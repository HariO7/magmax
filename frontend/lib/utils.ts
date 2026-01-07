const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const BACKEND_URL = API_BASE_URL.replace('/api', '');

/**
 * Get the full image URL for an article
 * Handles both relative paths (from Django media) and absolute URLs
 */
export function getImageUrl(image: string | null, imageUrl: string | null): string | null {
  if (imageUrl) {
    return imageUrl;
  }
  
  if (image) {
    // If image is already a full URL, return it
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    // Otherwise, prepend the backend URL
    return `${BACKEND_URL}${image}`;
  }
  
  return null;
}

