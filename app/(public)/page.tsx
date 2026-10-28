import { RedirectIfSignedIn } from "@/features/auth/components/redirect-if-signed-in";
import { ShortenForm } from "@/features/shorten/shorten-form";

export default function Home() {
  return (
    <main>
      <RedirectIfSignedIn />
      <ShortenForm />
    </main>
  );
}
