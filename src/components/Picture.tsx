type PictureProps = {
  /** AVIF first (a fraction of the size), JPEG for browsers without it. */
  avif: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** Above-the-fold images load immediately; everything else is lazy. */
  eager?: boolean;
};

/** Responsive-format image. Intrinsic width/height reserve the box before the
 *  file arrives, so nothing shifts while the page loads. */
export default function Picture({
  avif,
  src,
  alt,
  width,
  height,
  className,
  eager = false,
}: PictureProps) {
  return (
    <picture>
      <source srcSet={avif} type="image/avif" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
