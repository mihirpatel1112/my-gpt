import React from "react";
import { useRef } from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function TextArea(props: TextAreaProps) {
  const { ...otherProps } = props;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleResize = () => {
    const el = textAreaRef.current;
    if (el) {
      el.style.height = "auto";
      const maxRows = 7;
      const lineHeight = 24;
      const maxHeight = maxRows * lineHeight;

      el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
    }
  };

  return (
    <div className="my-2">
      <div className="bg-indigo-100 rounded-xl p-2 mx-auto drop-shadow-2xl border-1 border-indigo-500">
        <div>
          <textarea
            className="w-full focus:outline-none p-2"
            ref={textAreaRef}
            onInput={handleResize}
            {...otherProps}
          />
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 border border-indigo-500 rounded-full p-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
