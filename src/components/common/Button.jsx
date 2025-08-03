import React from "react";

const Button = ({
  children,
  type = "button",
  bgColor = "bg-[var(--primary-color)]",
  hover = "shadow",
  textColor = "text-[var(--white-color)]",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`px-4 md:px-8 py-1.5 md:py-2 font-medium text-sm md:text-base rounded-md transition-all duration-500 ease-in-out cursor-pointer ${bgColor} ${hover} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
