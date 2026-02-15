import React, { useEffect, useRef } from "react";

interface ButtonProps extends React.PropsWithChildren {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "submit" | "reset" | "button" | "reset";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClick = () => {
      const button = buttonRef.current;
      if (button) {
        let focusColour = "var(--color-button-focus)";
        let bgColour = "var(--color-button-bg)";
        if (type === "reset") {
          focusColour = "var(--color-button-bg)";
          bgColour = "var(--color-error)";
        }
        button.style.backgroundColor = focusColour;
        setTimeout(() => {
          button.style.backgroundColor = bgColour;
        }, 300);
      }
    };

    const button = buttonRef.current;
    if (button) {
      button.addEventListener("click", handleClick);
    }

    return () => {
      const button = buttonRef.current;
      if (button) {
        button.removeEventListener("click", handleClick);
      }
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      type={type}
      className={`standard ${className}`}
    >
      {children}
    </button>
  );
};
