export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return "/assets/placeholder.png"; // Return a placeholder if no path

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  try {
    const url = new URL(apiUrl);
    return `${url.origin}${path.startsWith('/') ? '' : '/'}${path}`;
  } catch (e) {
    return `http://localhost:8000${path.startsWith('/') ? '' : '/'}${path}`;
  }
};
