"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../config/AuthContext";

const LoginPage = () => {
    const { signInWithGoogle, user } = useAuth();
    const router = useRouter();

      useEffect(() => {
        if (user) {
          router.push("/");
        }
     }, [user, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 rounded-4xl">
            <div className="bg-white shadow-md rounded p-6 w-[650px] max-w-sm">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Login
                </h2>
                {user ? (
                    <p>
                        You are already logged in.
                    </p>
                ): (
                    <>
                        <button
                            onClick={signInWithGoogle}
                            className="mt-5 bg-black text-lamaGreen font-bold  text-sm rounded-lg h-12 w-full cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Image src='/google.png' alt='' width={20} height={20} />
                            Login with Google
                        </button>
                  </>
                )}
            </div>
        </div>
    );
};

export default LoginPage;