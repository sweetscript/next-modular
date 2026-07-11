import { Header } from "../../components/header";
import { SiteFooter } from "../../components/footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1a1a] flex flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
