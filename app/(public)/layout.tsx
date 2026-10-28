import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center space-y-18 px-3 text-foreground">
      <NavBar />
      <div className="w-full md:max-w-250 md:min-w-139">{children}</div>
      <Footer />
    </div>
  );
}
