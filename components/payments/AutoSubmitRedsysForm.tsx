"use client";

import { useEffect, useRef } from "react";

export default function AutoSubmitRedsysForm({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const form = containerRef.current.querySelector("form");
      if (form) {
        setTimeout(() => {
          form.submit();
        }, 500);
      }
    }
  }, []);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} className="hidden" />;
}
