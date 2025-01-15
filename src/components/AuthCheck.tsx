"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spin } from "antd";
import Navbar from "./Navbar";
import Image from "next/image";
import Link from "next/link";
import Menu from "./Menu";
import ChatBox from "./Chatbox";
import React from "react";
import { useAuth } from "../app/config/AuthContext";
interface LayoutProps {
  children: React.ReactNode;
}

const AuthCheck: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const isAuthPage = pathname === "/login";

  useEffect(() => {
    if (!isAuthPage) {
      if (!user) {
        router.push("/login");
      }
    } else {
      if (user) {
        router.push("/");
      }
    }
  }, [user, router, isAuthPage]);

  if (!user && isAuthPage) {
    return <>{children}</>;
  } else if (user && !isAuthPage) {
    return (
      <>
        <div className="h-screen flex">
          {/* LEFT */}
          <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
            <Link
              href="/"
              className="flex items-center justify-center lg:justify-start gap-2"
            >
              <Image src="/logo.webp" alt="logo" width={32} height={32} />
              <span className="hidden lg:block font-bold">Tracking</span>
            </Link>
            <Menu />
          </div>
          {/* RIGHT */}
          <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
            <Navbar signOut={signOut} />
            <main className="pb-8">{children}</main>
            <ChatBox />
          </div>
        </div>
      </>
    );
  } else {
    return <Spin />;
  }
};

export default AuthCheck;