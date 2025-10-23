"use client";
import Image from "next/image";
import { useMedia } from "@/hooks/useMedia";
import { useRef, useState } from "react";
import type { Project } from "@/data/projects";

type Props = {
  project: Project;
  onOpen: (id: string) => void;
};

export default function ProjectCard({ project, onOpen }: Props) {
  const isDesktop = useMedia("(min-width: 1024px)");
  const [hover, setHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { id, title, description, tags, image, video, gif } = project;

  const media = (
    <div className="relative w-full overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
      {/* Poster image */}
      <Image
        src={image}
        alt={title}
        width={800}
        height={450}
        className={`h-48 w-full object-cover transition duration-300 ${
          hover && video ? "opacity-0" : "opacity-100"
        }`}
        priority={false}
      />
      {/* Hover/inline video or gif */}
      {(video || gif) && (
        <>
          {video ? (
            <video
              ref={videoRef}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                (isDesktop && hover) || !isDesktop ? "opacity-100" : "opacity-0"
              }`}
              src={video}
              muted
              loop
              playsInline
              preload="none"
              autoPlay={!isDesktop} // auto-play on mobile, hover on desktop
            />
          ) : (
            <img
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                (isDesktop && hover) || !isDesktop ? "opacity-100" : "opacity-0"
              }`}
              src={gif}
              alt={`${title} preview`}
              loading="lazy"
            />
          )}
        </>
      )}
    </div>
  );

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        videoRef.current?.pause();
        videoRef.current && (videoRef.current.currentTime = 0);
      }}
      onClick={() => onOpen(id)}
      className="group grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-4 items-start
                 rounded-2xl border border-gray-200 dark:border-gray-800 p-4
                 hover:shadow-lg hover:-translate-y-0.5 transition bg-white/60 dark:bg-neutral-900/60"
    >
      {media}

      <div className="text-left">
        <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {title}
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-200/60 dark:border-white/10"
            >
              {t}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3 lg:line-clamp-none">
          {description}
        </p>
      </div>
    </button>
  );
}
