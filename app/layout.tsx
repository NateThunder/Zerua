import type { Metadata } from "next";
import { Anton, Montserrat } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zerua Music",
  description: "Zerua Music collective",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${anton.variable} ${montserrat.variable} antialiased bg-black text-white`}
      >
        {/* Background video is a direct child of body to avoid fixed-position bugs
            caused by ancestor filters/backdrop-filter creating new containing blocks. */}
        <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
          <video
            className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover object-[50%_40%] scale-125"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/media/zerua-overlay.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
