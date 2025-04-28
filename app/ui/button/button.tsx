import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick:()=> void;
  varient:"primary"|"secondary";
};

const styling = {
  "primary":"cursor-pointer pt-3 pb-3  pr-7 pl-7 bg-tertiary rounded-full text-main font-extrabold",
  "secondary":"cursor-pointer pt-3 pb-3  pr-7 pl-7 bg-main rounded-xl text-tertiary font-extrabold"
};

export default function Button({ children , onClick ,varient }: ButtonProps) {
  return (
    <button onClick={onClick} className={styling[varient]}>{children}
      </button>
  );
}
