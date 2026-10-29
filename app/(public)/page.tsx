import { RedirectIfSignedIn } from "@/features/auth/components/redirect-if-signed-in";
import { HomeNotes } from "@/features/shorten/home-notes";
import { ShortenForm } from "@/features/shorten/shorten-form";

export default function Home() {
  return (
    <main className="flex flex-col gap-28">
      <RedirectIfSignedIn />
      <ShortenForm />
      <HomeNotes />
    </main>
  );
}
