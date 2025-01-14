"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../config/supabase";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();


   useEffect(() => {
     // Initialize user from localStorage
     const savedUser = localStorage.getItem("user");
     setUser(savedUser ? JSON.parse(savedUser) : null);
 }, []);


    const signInWithGoogle = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/`,
                },
            });
            if (error) {
                console.error("Google sign-in error:", error);
            }
        } catch (error) {
            console.error("Google sign-in error:", error);
        }
    };

    const signOut = async () => {
      await supabase.auth.signOut();
      setUser(null);
        localStorage.removeItem("user");
        router.push("/login");
    };

    useEffect(() => {
         const getUser = async () => {
            const { data } = await supabase.auth.getSession();
            if (data?.session?.user) {
              const userMetadata = data.session.user.user_metadata;
              userMetadata.id = data.session.user.id;
                setUser(userMetadata);
              localStorage.setItem("user", JSON.stringify(userMetadata));

              const { id, email, full_name, avatar_url } = data.session.user.user_metadata;
             const { data: existingUser } = await supabase
                .from("users")
                 .select("*")
                .eq("id", data.session.user.id)
               .single();

            if (!existingUser) {
                 await supabase.from("users").insert([
                   {
                      id,
                      email,
                      full_name,
                      avatar_url,
                   },
                ]);
              }
            }
        };
          const { data: subscription } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const userMetadata = session?.user?.user_metadata || null;
               setUser(userMetadata);
                if (userMetadata) {
                   localStorage.setItem("user", JSON.stringify(userMetadata));
                } else {
                    localStorage.removeItem("user");
                 }
             }
        );

        getUser();

      return () => subscription.subscription.unsubscribe();
  }, [router]);
  return (
        <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);