import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Password encryption utilities based on backend requirements
// Backend expects: ToHex(passwd) -> ToBase64(reversedHex) -> ToRot13(reversedBase64)
export function encryptPassword(password: string): string {
  // Step 1: Convert to reversed hex using backend format
  const reversedHex = _0x8e9a(password);

  // Step 2: Convert to reversed base64 using backend format
  const reversedBase64 = _0x2a4b(reversedHex);

  // Step 3: Apply ROT13 encoding
  const encodedPassword = _0x6f5d(reversedBase64);

  // Debug logging if enabled
  if (process.env.NEXT_PUBLIC_ENABLE_API_LOGGING === "true") {
    console.log("[Password Encryption Debug]", {
      original: password,
      reversedHex: reversedHex,
      reversedBase64: reversedBase64,
      encodedPassword: encodedPassword,
    });
  }

  return encodedPassword;
}

// Obfuscated token generation functions for API requests
// These functions implement the backend's required token obfuscation

/**
 * Convert text to Base64 with obfuscation
 * @param password - The input text to encode
 * @returns Obfuscated base64 string
 */
function _0x2a4b(password: string): string {
  const _0x1f3e = password;
  const _0x4c7d = btoa(_0x1f3e);
  return _0x4c7d.split("").reverse().join("").replace(/=/g, "");
}

/**
 * Convert text to Hex with obfuscation
 * @param text - The input text to convert
 * @returns Obfuscated hex string
 */
function _0x8e9a(text: string): string {
  // Convert string to hex using simple character code conversion
  let hex = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    hex += charCode.toString(16).padStart(2, "0");
  }
  // Reverse the hex string
  return hex.split("").reverse().join("");
}

/**
 * Apply ROT13 encoding with obfuscation
 * @param str - The input string to encode
 * @returns ROT13 encoded string
 */
function _0x6f5d(str: string): string {
  return str.replace(/[A-Za-z]/g, function (char) {
    const _0x2e7a = char.charCodeAt(0);
    if (_0x2e7a >= 65 && _0x2e7a <= 90) {
      return String.fromCharCode(((_0x2e7a - 65 + 13) % 26) + 65);
    }
    if (_0x2e7a >= 97 && _0x2e7a <= 122) {
      return String.fromCharCode(((_0x2e7a - 97 + 13) % 26) + 97);
    }
    return char;
  });
}

/**
 * Generate obfuscated timestamp token for API requests
 * This implements the backend's required token generation algorithm
 * @returns Obfuscated token string
 */
export function generateTimestampToken(): string {
  const _0x4d8c = Math.floor(Date.now() / 1000) + 60;
  const _0x7b3f = _0x8e9a(_0x4d8c.toString());
  const _0x1e9d = _0x2a4b(_0x7b3f);
  const _0x5a2e = _0x6f5d(_0x1e9d);

  // Debug logging if enabled
  if (process.env.NEXT_PUBLIC_ENABLE_API_LOGGING === "true") {
    console.log("[Token Generation Debug]", {
      timestamp: _0x4d8c,
      timestampString: _0x4d8c.toString(),
      hexEncoded: _0x7b3f,
      base64Encoded: _0x1e9d,
      rot13Encoded: _0x5a2e,
    });
  }

  return _0x5a2e;
}
