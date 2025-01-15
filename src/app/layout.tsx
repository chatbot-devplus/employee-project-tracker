import "./globals.css";
import { AuthProvider } from "./config/AuthContext";
import AuthCheck from "../components/AuthCheck";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body>
        <AuthProvider>
               <AuthCheck>
                 {children}
                 </AuthCheck>
             </AuthProvider>
          
        </body>
    </html>
  );
}