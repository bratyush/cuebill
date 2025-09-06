import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "CueBill",
  description: "Manage your bills with ease",
  icons: [
    // { rel: "icon", url: "/fav-white.ico" },
    { rel: "icon", url: "/fav-white.png", type: "image/png" }
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body className={`font-sans `}>
          <div className="">
            <Toaster />
            {children}
          </div>
          <SpeedInsights />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
