"use client";

import { useState } from "react";

type AdminMediaUploadProps = {
  bucket: "release-covers" | "charts" | "merch";
  onUploaded: (path: string) => void;
};

export default function AdminMediaUpload({ bucket, onUploaded }: AdminMediaUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/admin/upload?bucket=${bucket}`, {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      onUploaded(json.data.path);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="w-full rounded border border-white/20 bg-black/20 px-3 py-2 text-sm text-white"
      />
      {loading && <p className="text-xs text-white/60">Uploading...</p>}
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
