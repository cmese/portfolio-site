// src/components/projects/ProjectSheet.tsx
"use client";
import * as Dialog from "@radix-ui/react-dialog";
import {
  FiX,
  FiExternalLink,
  FiGithub,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { useMedia } from "@/hooks/useMedia";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  project: Project;
};

export default function ProjectSheet({ open, onOpenChange, project }: Props) {
  const isDesktop = useMedia("(min-width: 1024px)");
  const {
    title,
    description,
    tags,
    image,
    video,
    gif,
    hrefDemo,
    hrefRepo,
    company,
    location,
    dates,
    highlights,
  } = project;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* darker overlay + heavier blur for readability */}
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md" />
        {/* Centered modal with margin, frosted panel, scrollable body */}
        <Dialog.Content
          className={`
            fixed z-[110]
            left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-[min(92vw, 960px)] max-h-[85vh]
            rounded-2xl border border-white/10
            bg-white/80 dark:bg-neutral-900/75
            shadow-2xl backdrop-blur-xl
            flex flex-col
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <Dialog.Title className="text-lg font-semibold">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10"
              >
                <FiX size={18} />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
            <div className="w-full overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
              {video ? (
                <video
                  src={video}
                  controls
                  playsInline
                  loop
                  muted
                  className="w-full h-auto"
                  poster={image}
                />
              ) : (
                <Image
                  src={image}
                  alt={title}
                  width={1200}
                  height={675}
                  className="w-full h-auto object-cover"
                />
              )}
            </div>

            {/* Meta row */}
            {(company || location || dates) && (
              <div className="flex flex-wrap gap-3 text-sm text-gray-800 dark:text-gray-300">
                {company && <span className="font-medium">{company}</span>}
                {location && (
                  <span className="inline-flex items-center gap-1">
                    <FiMapPin /> {location}
                  </span>
                )}
                {dates && (
                  <span className="inline-flex items-center gap-1">
                    <FiCalendar /> {dates}
                  </span>
                )}
              </div>
            )}

            {/* Tags */}
            {tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-200/60 dark:border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Description */}
            {description && (
              <p className="text-sm leading-7 text-gray-800 dark:text-gray-300">
                {description}
              </p>
            )}

            {/* Highlights (bullets) */}
            {highlights?.length ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800 dark:text-gray-300">
                {highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-white/10">
            {hrefRepo && (
              <a
                href={hrefRepo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-black/5 dark:hover:bg-white/10"
              >
                <FiGithub /> Code
              </a>
            )}
            {hrefDemo && (
              <a
                href={hrefDemo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                <FiExternalLink /> Live Site
              </a>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
