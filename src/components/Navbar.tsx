"use client";
import Image from "next/image";
import React from "react";
import { useAuth } from "../app/config/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="p-4  border-b flex items-center justify-between bg-white">
      {/* ICONS AND USER */}
      {user && (
        <div className="flex items-center gap-6 justify-end w-full">
          <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
            <Image src="/message.png" alt="" width={20} height={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs leading-3 font-medium">
              {user.full_name}
            </span>
          </div>
          <Image
            src={user.avatar_url}
            alt="avatar"
            width={36}
            height={36}
            className="rounded-full"
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
