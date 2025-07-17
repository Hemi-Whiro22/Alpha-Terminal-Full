import { useState } from "react";
import { useTi } from "./TiwhanawhanaProvider";

export default function ScanPanel() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { sendPrompt, tiResponse, loading } = useTi();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);

    // Upload image to get URL (uses /upload or /ocr/image or your custom endpoint)
    const res = await fetch("/upload/image", {
      method: "POST",
      body: formData
    });

    const { image_url } = await res.json();

    // Prompt Ti using that image
    await sendPrompt(`What is in this image, and what is it called in Māori? Here is the image: ${image_url}`);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="p-4 max-w-xl mx-auto space-y-4 bg-zinc-900 rounded-xl shadow-xl text-zinc-100 border-2 border-dashed border-emerald-600"
    >
      <h2 className="text-lg font-bold text-emerald-400">Drop an image for Tiwhanawhana to translate</h2>

      {preview && (
        <div className="rounded-xl overflow-hidden">
          <img src={preview} alt="Preview" className="w-full" />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!image || loading}
        className="bg-emerald-600 px-4 py-2 rounded-xl mt-2"
      >
        {loading ? "Scanning..." : "Scan & Translate"}
      </button>

      <div className="bg-zinc-800 p-4 rounded-xl mt-4">
        <strong className="block text-emerald-400 mb-2">Tiwhanawhana:</strong>
        <div>{tiResponse}</div>
      </div>
    </div>
  );
}
