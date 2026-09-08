"use client";

import { ScrollReveal } from "@/component/ui/ScrollReveal";
import { useLandingStore } from "@/store/landing-store";
import { faqs } from "./landing-data";

export const FAQ = () => {
  const openFaqIndex = useLandingStore((state) => state.openFaqIndex);
  const toggleFaq = useLandingStore((state) => state.toggleFaq);

  return (
    <section
      id="faq"
      className="w-full max-w-4xl mx-auto px-6 py-20 scroll-mt-24 relative z-10 border-t border-zinc-900"
    >
      <ScrollReveal delay={0.1}>
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-sans font-bold text-zinc-100 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
            Have questions about OceanUptime? We have answers.
          </p>
        </div>
      </ScrollReveal>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <ScrollReveal key={idx} delay={0.1 * idx}>
            <details
              open={openFaqIndex === idx}
              className="group [&_summary::-webkit-details-marker]:hidden border border-zinc-800 bg-zinc-900/10 hover:bg-zinc-900/30 rounded-xl overflow-hidden transition-colors duration-300"
            >
              <summary
                onClick={(e) => {
                  e.preventDefault();
                  toggleFaq(idx);
                }}
                className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-zinc-200 focus:outline-none select-none"
              >
                <h3 className="text-sm font-semibold">{faq.q}</h3>
                <span className="relative size-5 shrink-0 text-zinc-500 group-open:text-zinc-300 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-opacity duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 size-5 opacity-0 group-open:opacity-100 transition-opacity duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 12H4"
                    />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/50 pt-4 mt-[-8px]">
                {faq.a}
              </div>
            </details>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};