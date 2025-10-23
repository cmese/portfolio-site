"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { FiX, FiExternalLink, FiGithub } from "react-icons/fi";
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
  const { title, description, tags, image, video, gif, hrefDemo, hrefRepo } =
    project;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content
          className={`
            fixed bg-white dark:bg-neutral-900 shadow-2xl
            ${
              isDesktop ? "top-0 right-0 h-full w-[min(720px,48vw)]" : "inset-0"
            }
            flex flex-col
          `}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
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

          <div className="flex-1 overflow-auto p-4 space-y-4">
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

            <p className="text-sm leading-7 text-gray-800 dark:text-gray-300">
              {description}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-800">
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
                <FiExternalLink /> Live Demo
              </a>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
