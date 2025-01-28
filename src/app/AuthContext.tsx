"use client"
import "./globals.css";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase/init";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const path = usePathname();

  console.log(user)

  if (!loading && !user && path !== "/" && !path.startsWith("/auth")) {
    router.push("/auth/login");
  }
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
