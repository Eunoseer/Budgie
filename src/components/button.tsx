import React, { useEffect, useRef } from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, type }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClick = () => {
      const button = buttonRef.current;
      if (button) {
        button.style.backgroundColor = "var(--color-button-focus)";
        setTimeout(() => {
          button.style.backgroundColor = "var(--color-button-bg)";
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
    <button ref={buttonRef} onClick={onClick} type={type}>
      {children}
    </button>
  );
};
