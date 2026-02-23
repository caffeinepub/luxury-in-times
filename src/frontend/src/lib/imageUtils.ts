/**
 * Converts a Uint8Array image to a blob URL for display
 */
export function imageToUrl(imageBytes: Uint8Array): string {
  // Create a new Uint8Array with ArrayBuffer to ensure type compatibility
  const buffer = new Uint8Array(imageBytes);
  const blob = new Blob([buffer.buffer], { type: 'image/jpeg' });
  return URL.createObjectURL(blob);
}

/**
 * Revokes a blob URL to free memory
 */
export function revokeImageUrl(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}
