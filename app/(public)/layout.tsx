import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center space-y-18 px-4 text-foreground sm:px-8 lg:px-12">
      <NavBar />
      <div className="w-full md:max-w-250 md:min-w-139">{children}</div>
      <Footer />
    </div>
  );
}
