import { useState } from "react";

import { getOptimizedImage } from "../lib/optimizedImage";

type OptimizedImageProps = {
  /** Original asset path used as manifest key (e.g. /images/fellows/foo.jpg). */
  originalSrc: string;
  alt: string;
  sizes: string;
  className?: string;
  wrapperClassName?: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  decoding?: "async" | "sync" | "auto";
  fetchPriority?: "high" | "low" | "auto";
};

export function OptimizedImage({
  originalSrc,
  alt,
  sizes,
  className,
  wrapperClassName,
  width,
  height,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
}: OptimizedImageProps) {
  const opt = getOptimizedImage(originalSrc);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!opt || failed) {
    return (
      <img
        src={originalSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        sizes={sizes}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
      />
    );
  }

  const img = (
    <img
      src={opt.src}
      srcSet={opt.srcSet}
      sizes={sizes}
      alt={alt}
      className={`${className ?? ""} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
    />
  );

  if (!wrapperClassName) return img;

  return (
    <div
      className={wrapperClassName}
      style={{
        backgroundImage: `url(${opt.placeholder})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {img}
    </div>
  );
}
