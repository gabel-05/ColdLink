import "./globals.css";
import AppNav from "@/components/app-nav";

export const metadata = {
  title: "ColdLink PH Decision System",
  description: "Agricultural cold chain coordination platform for routing decisions."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto min-h-screen max-w-7xl px-6 py-8 md:px-10">
          <header className="mb-8 rounded-2xl border border-[#2E5E3E]/15 bg-white/90 p-5 shadow-[0_8px_20px_rgba(46,94,62,0.08)] backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8B5E3C]">
                  ColdLink PH
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-[#2E5E3E]">
                  Agricultural Coordination System
                </h1>
              </div>
              <AppNav />
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
