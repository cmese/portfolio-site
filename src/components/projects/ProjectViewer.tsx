"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiExternalLink, FiX } from "react-icons/fi";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  code: string;
  demoUrl: string;
};

export default function ProjectViewer({
  open,
  onOpenChange,
  title,
  code,
  demoUrl,
}: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 max-h-[90vh] w-[90vw] max-w-3xl
                     -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-900
                     shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-700 px-4 py-2">
            <Dialog.Title className="text-lg font-medium text-white">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="text-gray-400 hover:text-red-500"
              >
                <FiX size={18} />
              </button>
            </Dialog.Close>
          </div>

          {/* code block */}
          <div className="overflow-y-auto p-4">
            <SyntaxHighlighter
              language="tsx"
              style={materialOceanic}
              customStyle={{ borderRadius: "0.5rem", fontSize: "0.85rem" }}
              showLineNumbers
            >
              {code}
            </SyntaxHighlighter>
          </div>

          {/* footer */}
          <div className="flex justify-end gap-3 border-t border-gray-700 px-4 py-2">
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5
                         text-white transition hover:bg-blue-700"
            >
              Live Demo
              <FiExternalLink size={14} />
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
