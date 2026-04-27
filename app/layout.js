import "./globals.css";
import ControlTowerShell from "@/components/control-tower-shell";

export const metadata = {
  title: "ColdLink PH — Control Tower",
  description:
    "Cold chain coordination platform for LGUs, cooperatives, farmers, and traders — operations simulation."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ControlTowerShell>{children}</ControlTowerShell>
      </body>
    </html>
  );
}
