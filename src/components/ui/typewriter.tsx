"use client";

import { useEffect, useState } from "react";

interface TypeWriterProps {
  text: string;
  delay?: number;
  className?: string;
}

export function TypeWriter({ text, delay = 30, className }: TypeWriterProps) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  useEffect(() => {
    // Reset when text changes
    setCurrentText("");
    setCurrentIndex(0);
  }, [text]);

  return <span className={className}>{currentText}</span>;
}
