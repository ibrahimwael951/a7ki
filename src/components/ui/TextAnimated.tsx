import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
interface Props {
  children: React.ReactNode;
  href?: string;
  a?: string;
  className?: string;
}
const TextAnimated = ({ a, className, href, children }: Props) => {
  if (href)
    return (
      <Link href={href}>
        <TextAnimated className={className}>{children}</TextAnimated>
      </Link>
    );
  if (a)
    return (
      <a href={a} target="_blank" rel="noopener noreferrer">
        <TextAnimated className={className}>{children}</TextAnimated>
      </a>
    );
  return (
    <div className={cn("relative group overflow-hidden w-full", className)}>
      <div className="group-hover:-translate-y-full duration-150">
        {children}
      </div>
      <div className="absolute top-2/4 left-2/4 -translate-x-2/4 translate-y-full group-hover:-translate-y-2/4 duration-150 w-full">
        {children}
      </div>
    </div>
  );
};

export default TextAnimated;
