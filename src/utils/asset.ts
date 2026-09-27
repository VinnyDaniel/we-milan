/**
 * Helper to ensure assets (images, icons) resolve correctly both locally and on GitHub Pages
 */
export function assetPath(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${prefix}${cleanPath}`;
}

export default assetPath;
