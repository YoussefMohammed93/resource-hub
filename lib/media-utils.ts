// Utility functions for handling external media URLs

export interface MediaInfo {
  url: string;
  type: 'image' | 'video' | 'unknown';
  thumbnail?: string;
  originalUrl: string;
}

/**
 * Extract media information from various external URLs
 */
export function extractMediaInfo(url: string): MediaInfo {
  const originalUrl = url;
  
  // Handle Freepik URLs
  if (url.includes('freepik.com')) {
    return extractFreepikMediaInfo(url);
  }
  
  // Handle Shutterstock URLs
  if (url.includes('shutterstock.com')) {
    return extractShutterstockMediaInfo(url);
  }
  
  // Handle direct media URLs
  if (isDirectMediaUrl(url)) {
    return {
      url,
      type: getMediaTypeFromUrl(url),
      originalUrl,
    };
  }
  
  // Default fallback
  return {
    url,
    type: 'unknown',
    originalUrl,
  };
}

/**
 * Extract media info from Freepik URLs
 */
function extractFreepikMediaInfo(url: string): MediaInfo {
  const originalUrl = url;
  
  // Extract ID from various Freepik URL patterns
  const id = extractFreepikId(url);
  
  if (id) {
    // Determine type from URL
    let type: 'image' | 'video' | 'unknown' = 'unknown';
    if (url.includes('free-photo')) {
      type = 'image';
    } else if (url.includes('free-video')) {
      type = 'video';
    } else if (url.includes('free-vector')) {
      type = 'image';
    }
    
    // Try to construct direct media URLs
    const possibleUrls = generateFreepikMediaUrls(id, type);
    
    return {
      url: possibleUrls[0] || url, // Use first possible URL as primary
      type,
      thumbnail: type === 'video' ? possibleUrls[0] : undefined,
      originalUrl,
    };
  }
  
  return {
    url: originalUrl,
    type: 'unknown',
    originalUrl,
  };
}

/**
 * Extract media info from Shutterstock URLs
 */
function extractShutterstockMediaInfo(url: string): MediaInfo {
  // Shutterstock URL handling logic
  return {
    url,
    type: url.includes('video') ? 'video' : 'image',
    originalUrl: url,
  };
}

/**
 * Extract ID from Freepik URLs using various patterns
 */
function extractFreepikId(url: string): string | null {
  const patterns = [
    // Pattern: /free-photo/description_12345.htm
    /\/free-(?:photo|video|vector)\/[^_]+_(\d+)\.htm/,
    // Pattern: /free-photo/description-12345.htm
    /\/free-(?:photo|video|vector)\/[^-]+-(\d+)\.htm/,
    // Pattern: /free-video/description_12345
    /\/free-(?:photo|video|vector)\/[^_]+_(\d+)$/,
    // Pattern: /free-video/description/12345
    /\/free-(?:photo|video|vector)\/[^\/]+\/(\d+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Generate possible Freepik media URLs based on ID and type
 */
function generateFreepikMediaUrls(id: string, type: 'image' | 'video' | 'unknown'): string[] {
  const baseUrls = [
    'https://img.freepik.com',
    'https://cdn.freepik.com',
  ];
  
  const extensions = type === 'video' ? ['mp4', 'webm', 'jpg'] : ['jpg', 'jpeg', 'png', 'webp'];
  const paths = type === 'video' ? ['free-video', 'videos'] : ['free-photo', 'free-vector', 'photos'];
  
  const urls: string[] = [];
  
  for (const baseUrl of baseUrls) {
    for (const path of paths) {
      for (const ext of extensions) {
        urls.push(`${baseUrl}/${path}/${id}.${ext}`);
        urls.push(`${baseUrl}/${path}/preview/${id}.${ext}`);
        urls.push(`${baseUrl}/${path}/thumb/${id}.${ext}`);
      }
    }
  }
  
  return urls;
}

/**
 * Check if URL is a direct media URL
 */
function isDirectMediaUrl(url: string): boolean {
  const mediaExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
    '.mp4', '.webm', '.avi', '.mov', '.wmv'
  ];
  
  const lowerUrl = url.toLowerCase();
  return mediaExtensions.some(ext => lowerUrl.includes(ext));
}

/**
 * Determine media type from URL
 */
function getMediaTypeFromUrl(url: string): 'image' | 'video' | 'unknown' {
  const lowerUrl = url.toLowerCase();
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const videoExtensions = ['.mp4', '.webm', '.avi', '.mov', '.wmv'];
  
  if (imageExtensions.some(ext => lowerUrl.includes(ext))) {
    return 'image';
  }
  
  if (videoExtensions.some(ext => lowerUrl.includes(ext))) {
    return 'video';
  }
  
  return 'unknown';
}

/**
 * Generate a placeholder URL for failed media
 */
export function generatePlaceholderUrl(type: 'image' | 'video' | 'unknown' = 'unknown'): string {
  const icon = type === 'video' ? '🎥' : type === 'image' ? '📷' : '🎨';
  const label = type === 'video' ? 'Video Preview' : type === 'image' ? 'Image Preview' : 'Media Preview';
  
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="40%" text-anchor="middle" font-family="Arial, sans-serif" font-size="48">${icon}</text>
      <text x="50%" y="60%" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#6b7280">
        ${label}
      </text>
      <text x="50%" y="75%" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#9ca3af">
        External ${type} content
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
