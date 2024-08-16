const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src;
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
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  const paramsString = params.join(",");
  const result = `${process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_SITE : ""}/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
  return result;
}
