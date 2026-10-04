import { useEffect, useRef, useState } from "react";
import Picture from "./Picture";

type BackdropVideoProps = {
  /** Short, silent, seamless loop (H.264 mp4). */
  src: string;
  /** First frame of the loop, so still and motion are the same shot. */
  posterAvif: string;
  poster: string;
  width: number;
  height: number;
};

// Motion and data are the visitor's call: reduced motion or Save-Data means
// the poster stays a still and the clip is never downloaded.
function videoAllowed() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return !connection?.saveData;
}

/** Full-bleed footage behind a band of text. The poster paints first; the
 *  clip is fetched only when the band nears the viewport and plays only
 *  while it is on screen. Purely decorative. */
export default function BackdropVideo({
  src,
  posterAvif,
  poster,
  width,
  height,
}: BackdropVideoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el || !videoAllowed()) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          // autoplay can be refused (e.g. Low Power Mode): the poster remains
          video.current?.play().catch(() => {});
        } else {
          video.current?.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} aria-hidden className="absolute inset-x-0 inset-y-2 overflow-clip">
      <Picture
        avif={posterAvif}
        src={poster}
        alt=""
        width={width}
        height={height}
        className="h-full w-full object-cover"
      />
      {load && (
        <video
          ref={video}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
