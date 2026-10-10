"use client";

import { useRef, useState } from "react";

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
    <div className="space-y-2">
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            aria-label="URL to shorten"
            type="text"
            autoFocus
            placeholder="https://example.com/very/long/link"
            className="h-13 bg-card pr-20 font-mono"
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
            size="sm"
            className="absolute inset-y-0 right-2 my-auto"
            disabled={loading}
            onClick={paste}
          >
            Paste
          </Button>
        </div>
        <Button type="submit" className="h-13 min-w-32 px-6" disabled={loading || !url.trim()}>
          {loading ? "Shortening…" : "Shorten"}
        </Button>
      </form>
      {message && (
        <Typography as="p" variant="small" role="alert" className="text-destructive">
          {message}
        </Typography>
      )}
    </div>
  );
}
