export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[]; // e.g. ["React", "TypeScript", "Tailwind"]
  image: string; // poster/thumbnail (png/jpg/webp)
  video?: string; // mp4/webm for preview (preferred over gif)
  gif?: string; // optional fallback if no video
  hrefDemo?: string;
  hrefRepo?: string;
};

export const projects: Project[] = [
  {
    id: "mv-aac",
    title: "Mosaic Voice – AAC",
    description:
      "On-device AAC app with RN + Swift/Kotlin modules, offline LLM assist.",
    tags: ["React Native", "Swift", "Kotlin", "FastAPI", "LLM"],
    image: "/projects/mv/poster.webp",
    video: "/projects/mv/preview.webm",
    hrefDemo: "https://example.com/demo",
    hrefRepo: "https://github.com/your/mv",
  },
  {
    id: "micjo",
    title: "MicJo B2B",
    description:
      "Magento tooling for bulk ops; import pipeline & admin UX rework.",
    tags: ["PHP", "Magento", "MySQL", "Redis"],
    image: "/projects/micjo.png",
    gif: "/projects/micjo.gif",
    hrefDemo: "https://example.com/micjo",
  },
  // …more
];

// export const projects = [
//   {
//     id: "p-1",
//     title: "Todo App",
//     description: "Full-stack React + FastAPI todo tracker.",
//     code: `// TodoApp.jsx
// import { useState } from 'react';
//
// export default function TodoApp() {
//   const [items, setItems] = useState<string[]>([]);
//   const add = (text: string) => setItems([...items, text]);
//   return <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>;
// }`,
//     demoUrl: "https://todo-demo.example.com",
//   },
//   {
//     id: "p-2",
//     title: "Todo App",
//     description: "Full-stack React + FastAPI todo tracker.",
//     code: `// TodoApp.jsx
// import { useState } from 'react';
//
// export default function TodoApp() {
//   const [items, setItems] = useState<string[]>([]);
//   const add = (text: string) => setItems([...items, text]);
//   return <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>;
// }`,
//     demoUrl: "https://todo-demo.example.com",
//   },
//   // add more items ...
// ];
//
