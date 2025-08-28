// Real file download utilities with progress tracking
export interface DownloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface DownloadOptions {
  onProgress?: (progress: DownloadProgress) => void;
  onComplete?: (filename: string) => void;
  onError?: (error: Error) => void;
  filename?: string;
  taskId?: string;
}

/**
 * Downloads a file from a URL and saves it to the user's device
 * @param url - The URL to download from
 * @param options - Download options including progress callbacks
 */
export async function downloadFile(
  url: string,
  options: DownloadOptions = {}
): Promise<void> {
  const { onProgress, onComplete, onError, filename } = options;

  try {
    // For S3 signed URLs or CORS-restricted URLs, try direct link approach first
    if (
      url.includes("s3.") ||
      url.includes("amazonaws.com") ||
      url.includes("backblazeb2.com")
    ) {
      try {
        await downloadViaDirectLink(url, filename, onComplete);
        return;
      } catch (directError) {
        console.log(
          "Direct link download failed, trying fetch approach:",
          directError
        );
        // Continue with fetch approach below
      }
    }

    const response = await fetch(url, {
      mode: "cors",
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentLength = response.headers.get("content-length");
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      loaded += value.length;

      if (onProgress && total > 0) {
        onProgress({
          loaded,
          total,
          percentage: Math.round((loaded / total) * 100),
        });
      }
    }

    // Combine all chunks into a single Uint8Array
    const allChunks = new Uint8Array(loaded);
    let offset = 0;
    for (const chunk of chunks) {
      allChunks.set(chunk, offset);
      offset += chunk.length;
    }

    // Create blob and download
    const blob = new Blob([allChunks]);
    const downloadUrl = URL.createObjectURL(blob);

    // Determine filename
    let finalFilename = filename;
    if (!finalFilename) {
      // Try to get filename from Content-Disposition header
      const contentDisposition = response.headers.get("content-disposition");
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch) {
          finalFilename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      // Fallback to URL-based filename
      if (!finalFilename) {
        finalFilename = extractFilenameFromUrl(url) || "download";
      }
    }

    // Ensure we have a valid filename
    const validFilename = finalFilename || "download";

    // Create download link and trigger download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = validFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(downloadUrl);

    if (onComplete) {
      onComplete(validFilename);
    }
  } catch (error) {
    const downloadError =
      error instanceof Error
        ? error
        : new Error("Network error during download");
    if (onError) {
      onError(downloadError);
    }
    throw downloadError;
  }
}

/**
 * Downloads a file using direct link approach (for S3 signed URLs)
 */
async function downloadViaDirectLink(
  url: string,
  filename?: string,
  onComplete?: (filename: string) => void
): Promise<void> {
  return new Promise((resolve) => {
    const finalFilename = filename || extractFilenameFromUrl(url) || "download";

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = finalFilename;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    // Add to DOM temporarily
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Clean up
    document.body.removeChild(link);

    // Since we can't track direct link downloads, assume success after a short delay
    setTimeout(() => {
      if (onComplete) {
        onComplete(finalFilename);
      }
      resolve();
    }, 1000);
  });
}

/**
 * Downloads a file using the backend API and saves it to the user's device
 * @param downloadUrl - The original URL to download
 * @param options - Download options including progress callbacks
 */
export async function downloadFileViaApi(
  downloadUrl: string,
  options: DownloadOptions = {}
): Promise<void> {
  const { onProgress, onComplete, onError, filename, taskId } = options;

  try {
    // Get authentication token
    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    if (!token) {
      throw new Error("Authentication required for download");
    }

    // Create XMLHttpRequest for progress tracking
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.open("POST", "/api/download/file", true);
      // Don't set responseType initially - we'll handle both blob and text responses
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      // Track download progress
      xhr.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: DownloadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          };
          onProgress(progress);
        }
      };

      xhr.onreadystatechange = () => {
        // When headers are received, check if it's a successful response
        if (xhr.readyState === 2) {
          // HEADERS_RECEIVED
          if (xhr.status === 200) {
            // Set response type to blob for successful downloads
            xhr.responseType = "blob";
          } else {
            // Keep as text for error responses
            xhr.responseType = "text";
          }
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = xhr.response as Blob;

          // Validate blob size
          if (blob.size === 0) {
            const error = new Error("Downloaded file is empty");
            if (onError) {
              onError(error);
            }
            reject(error);
            return;
          }

          // Try to get filename from response headers
          const contentDisposition = xhr.getResponseHeader(
            "Content-Disposition"
          );
          let downloadFilename = filename;

          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(
              /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
            );
            if (filenameMatch && filenameMatch[1]) {
              downloadFilename = filenameMatch[1].replace(/['"]/g, "");
            }
          }

          if (!downloadFilename) {
            downloadFilename =
              extractFilenameFromUrl(downloadUrl) || "download";
          }

          // Ensure filename has proper extension
          if (!downloadFilename.includes(".")) {
            const contentType = xhr.getResponseHeader("Content-Type");
            if (contentType) {
              const extension = getExtensionFromMimeType(contentType);
              if (extension) {
                downloadFilename += extension;
              }
            }
          }

          // Create download link and trigger download
          const downloadBlobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadBlobUrl;
          link.download = downloadFilename;

          // Ensure the link is properly styled and hidden
          link.style.display = "none";

          // Append to body, click, and remove
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up object URL after a short delay
          setTimeout(() => {
            window.URL.revokeObjectURL(downloadBlobUrl);
          }, 100);

          if (onComplete) {
            onComplete(downloadFilename);
          }
          resolve();
        } else {
          // Handle error responses
          let errorMessage = `Download failed with status: ${xhr.status}`;

          // Try to parse error response
          try {
            let responseText = "";

            if (typeof xhr.response === "string") {
              responseText = xhr.response;
            } else if (xhr.responseText) {
              responseText = xhr.responseText;
            }

            if (responseText) {
              const errorData = JSON.parse(responseText);
              if (errorData.error) {
                errorMessage = errorData.error;
              }
            }
          } catch {
            // Use default error messages for specific status codes
            if (xhr.status === 401) {
              errorMessage = "Authentication expired. Please log in again.";
            } else if (xhr.status === 403) {
              errorMessage =
                "Access denied. You may not have permission to download this file.";
            } else if (xhr.status === 404) {
              errorMessage = "File not found or no longer available.";
            } else if (xhr.status === 400) {
              errorMessage =
                "Invalid download request. Please check the URL and try again.";
            } else if (xhr.status >= 500) {
              errorMessage = "Server error occurred. Please try again later.";
            }
          }

          const error = new Error(errorMessage);
          if (onError) {
            onError(error);
          }
          reject(error);
        }
      };

      xhr.onerror = () => {
        const error = new Error(
          "Network error during download. Please check your internet connection."
        );
        if (onError) {
          onError(error);
        }
        reject(error);
      };

      xhr.ontimeout = () => {
        const error = new Error(
          "Download timeout. The file may be too large or the connection is slow."
        );
        if (onError) {
          onError(error);
        }
        reject(error);
      };

      // Set timeout to 10 minutes for API downloads
      xhr.timeout = 600000;

      // Send the request with download URL and task ID
      xhr.send(JSON.stringify({ downloadUrl, taskId }));
    });
  } catch (error) {
    const downloadError =
      error instanceof Error ? error : new Error("Unknown download error");
    if (onError) {
      onError(downloadError);
    }
    throw downloadError;
  }
}

/**
 * Extract filename from URL
 * @param url - The URL to extract filename from
 * @returns The extracted filename or null
 */
function extractFilenameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split("/").pop();

    if (filename && filename.includes(".")) {
      return decodeURIComponent(filename);
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Get file extension from URL or filename
 * @param urlOrFilename - URL or filename to extract extension from
 * @returns The file extension (with dot) or empty string
 */
export function getFileExtension(urlOrFilename: string): string {
  try {
    const filename = urlOrFilename.includes("://")
      ? extractFilenameFromUrl(urlOrFilename) || ""
      : urlOrFilename;

    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex > 0 && lastDotIndex < filename.length - 1) {
      return filename.substring(lastDotIndex);
    }

    return "";
  } catch {
    return "";
  }
}

/**
 * Format file size in human readable format
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Get file extension from MIME type
 * @param mimeType - MIME type to convert
 * @returns File extension with dot or empty string
 */
function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    "image/bmp": ".bmp",
    "image/tiff": ".tiff",
    "video/mp4": ".mp4",
    "video/avi": ".avi",
    "video/quicktime": ".mov",
    "video/x-msvideo": ".avi",
    "video/webm": ".webm",
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    "audio/flac": ".flac",
    "audio/aac": ".aac",
    "audio/ogg": ".ogg",
    "application/pdf": ".pdf",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      ".docx",
    "application/vnd.ms-excel": ".xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      ".xlsx",
    "application/vnd.ms-powerpoint": ".ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      ".pptx",
    "application/zip": ".zip",
    "application/x-rar-compressed": ".rar",
    "application/x-7z-compressed": ".7z",
    "application/x-tar": ".tar",
    "application/gzip": ".gz",
    "text/plain": ".txt",
    "text/csv": ".csv",
    "application/json": ".json",
    "application/xml": ".xml",
    "text/xml": ".xml",
    "text/html": ".html",
    "text/css": ".css",
    "application/javascript": ".js",
    "text/javascript": ".js",
  };

  const cleanMimeType = mimeType.split(";")[0].trim().toLowerCase();
  return mimeToExt[cleanMimeType] || "";
}

/**
 * Validate if URL is downloadable
 * @param url - URL to validate
 * @returns True if URL appears to be downloadable
 */
export function isDownloadableUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);

    // Check if it's a valid HTTP/HTTPS URL
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return false;
    }

    // Check for common file extensions
    const pathname = urlObj.pathname.toLowerCase();
    const downloadableExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".bmp",
      ".tiff",
      ".mp4",
      ".avi",
      ".mov",
      ".wmv",
      ".flv",
      ".webm",
      ".mkv",
      ".mp3",
      ".wav",
      ".flac",
      ".aac",
      ".ogg",
      ".wma",
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
      ".zip",
      ".rar",
      ".7z",
      ".tar",
      ".gz",
      ".exe",
      ".msi",
      ".dmg",
      ".pkg",
      ".deb",
      ".rpm",
      ".txt",
      ".csv",
      ".json",
      ".xml",
      ".html",
      ".css",
      ".js",
    ];

    return downloadableExtensions.some((ext) => pathname.includes(ext));
  } catch {
    return false;
  }
}
