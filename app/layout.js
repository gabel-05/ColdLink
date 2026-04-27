import "./globals.css";

export const metadata = {
  title: "ColdLink PH",
  description: "Cold chain coordination MVP for storage and timing decisions."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
