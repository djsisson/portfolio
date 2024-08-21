const normalizeSrc = (src: string) => {
  return src.startsWith("/assets/") ? src.slice(8) : src;
};

export default function cloudflareLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const params = [`w=${width}`];
  if (quality) {
    params.push(`q=${quality}`);
  }
  const paramsString = params.join("&");
  const result = `${process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_SITE : ""}/cdn/?${paramsString}&i=${normalizeSrc(src)}`;
  return result;
}
