"use client";

import Section from "@/components/Section";
import ContactForm from "@/components/contact/ContactForm";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export default function Contact() {
  return (
    <Section id="contact" className="gap-8">
      <div className="text-center space-y-2">
        <h1 className="text-5xl md:text-7xl font-bold">Wanna hire me?</h1>
        <p className="text-xl md:text-2xl opacity-80">Let’s build something.</p>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <ContactForm />
        {/* subtle secondary row (kept minimal) */}
        <div className="mt-6 flex items-center justify-center gap-4 text-sm opacity-80">
          <a
            href="mailto:you@example.com"
            className="inline-flex items-center gap-2 hover:opacity-100 transition"
          >
            <FiMail /> Email
          </a>
          <span aria-hidden>•</span>
          <a
            href="https://www.linkedin.com/in/your-handle"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:opacity-100 transition"
          >
            <FiLinkedin /> LinkedIn
          </a>
          <span aria-hidden>•</span>
          <a
            href="https://github.com/your-handle"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:opacity-100 transition"
          >
            <FiGithub /> GitHub
          </a>
        </div>
      </div>
    </Section>
  );
}
