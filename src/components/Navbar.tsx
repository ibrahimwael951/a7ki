"use client";
import { useState } from "react";
import { mainLinks } from "@/data/MainLinks";
import Link from "next/link";
import GlassSurface from "./ui/GlassSurface";
import { Button } from "./ui/button";
import { HeartHandshake } from "lucide-react";
import ThemeButton from "./ui/ThemeButton";

const Navbar = () => {
  const [menu, setMenu] = useState<Boolean>(false);
  return (
    <>
      <GlassSurface
        displace={15}
        distortionScale={-150}
        redOffset={5}
        greenOffset={15}
        blueOffset={25}
        brightness={60}
        opacity={0.8}
        className="fixed top-3 left-2/4 -translate-x-2/4 w-full! max-w-[90%] lg:max-w-4xl z-40 "
      >
        <div className="w-full px-5 py-2.5 flex justify-between items-center gap-5 z-20 ">
          <Link href={"/"} className="flex justify-center items-center gap-2">
            <HeartHandshake size={35} />
            A7KI
          </Link>

          <div className="hidden md:flex justify-center items-center gap-4 ">
            {mainLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative group overflow-hidden"
              >
                <div className="group-hover:-translate-y-full duration-150">
                  {item.label}
                </div>
                <div className="absolute top-2/4 left-2/4 -translate-x-2/4 translate-y-full group-hover:-translate-y-2/4 duration-150">
                  {item.label}
                </div>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex justify-center items-center gap-3">
            <ThemeButton />
            <Button link={"/send"}>Send Message</Button>
          </div>

          {/* Mobile Button */}
          <div className="flex justify-center items-center gap-2">
            <Button variant={"ghost"} onClick={() => setMenu(!menu)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 cursor-pointer md:hidden"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9h16.5m-16.5 6.75h16.5"
                />
              </svg>
            </Button>
            <ThemeButton />
          </div>
        </div>
      </GlassSurface>
    </>
  );
};

export default Navbar;
