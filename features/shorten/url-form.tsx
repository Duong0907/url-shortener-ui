"use client";

import { useRef, useState } from "react";
import { LoaderIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";

type Props = {
  loading: boolean;
  error: string | null;
  onSubmit: (url: string) => void;
};

export function UrlForm({ loading, error, onSubmit }: Props) {
  const [url, setUrl] = useState("");
  const [pasteError, setPasteError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(url.trim());
  }

  async function paste() {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      setPasteError(null);
      if (!text) return;
      setUrl(text);
      inputRef.current?.focus();
    } catch {
      setPasteError("Can't read the clipboard. Paste it into the field instead");
    }
  }

  const message = error ?? pasteError;

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={submit} className="flex gap-3">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            aria-label="URL to shorten"
            type="text"
            autoFocus
            placeholder="https://example.com/very/long/link"
            className="pr-20"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setPasteError(null);
            }}
            readOnly={loading}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="absolute inset-y-0 right-2 my-auto"
            disabled={loading}
            onClick={paste}
          >
            Paste
          </Button>
        </div>
        <Button type="submit" disabled={loading || !url.trim()}>
          {loading && <LoaderIcon aria-hidden className="size-4 animate-spin" />}
          {loading ? "Shortening..." : "Shorten"}
        </Button>
      </form>
      {message && (
        <Typography role="alert" className="text-sm text-destructive">
          {message}
        </Typography>
      )}
    </div>
  );
}
