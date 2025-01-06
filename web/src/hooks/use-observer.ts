import React, { useEffect } from "react";

export const useObserver = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  callback: () => void,
  options: IntersectionObserverInit = {
    root: null,
    rootMargin: "100px",
    threshold: 0.5,
  }
) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        callback();
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.disconnect();
      }
    };
  }, [ref, callback, options]);
};
