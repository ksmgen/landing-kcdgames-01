"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";

export type PictureKey = "retailArea" | "playArea";
export type SurveyImage = { key: PictureKey; fileType: "image/jpeg" | "image/png" | "image/webp"; base64: string };
export const UPLOAD_SELECTED = "upload-selected";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ImageStore = { images: Partial<Record<PictureKey, SurveyImage>>; setImage: (key: PictureKey, image?: SurveyImage) => void; clearImages: () => void };
const ImagesContext = createContext<ImageStore | null>(null);

export function SurveyImagesProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<ImageStore["images"]>({});
  return <ImagesContext.Provider value={{ images, setImage: (key, image) => setImages((current) => ({ ...current, [key]: image })), clearImages: () => setImages({}) }}>{children}</ImagesContext.Provider>;
}
export function useSurveyImages() {
  const context = useContext(ImagesContext);
  if (!context) throw new Error("Survey image provider missing");
  return context;
}

export function validateImageFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error("Choose a JPEG, PNG or WebP image.");
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error("Each image must be non-empty and no larger than 5 MB.");
}

/** Decode and re-encode to strip metadata, bound dimensions and reduce request size. */
export async function prepareImage(file: File, key: PictureKey): Promise<SurveyImage> {
  validateImageFile(file);
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read this image. Please select it again."));
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("This file is not a readable image. Choose another JPEG, PNG or WebP."));
    image.src = source;
  });
  if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 40000000) throw new Error("Image dimensions are too large. Resize the photo and select it again.");
  const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image processing is unavailable in this browser.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const dataURL = canvas.toDataURL("image/jpeg", 0.82);
  const base64 = dataURL.split(",")[1];
  if (!dataURL.startsWith("data:image/jpeg;base64,") || !base64 || base64.length * 0.75 > MAX_IMAGE_BYTES) throw new Error("Image could not be resized below 5 MB. Choose a smaller photo.");
  return { key, fileType: "image/jpeg", base64 };
}

export function PictureUpload({ pictureKey, label, selected, onChange, onBusy }: { pictureKey: PictureKey; label: string; selected: string; onChange: (marker: string) => void; onBusy: (busy: boolean) => void }) {
  const { images, setImage } = useSurveyImages();
  const image = images[pictureKey];
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const version = useRef(0);
  const id = `${pictureKey}-upload`;
  return <div className="mb-6">
    <label htmlFor={id} className="mb-2 block font-display text-base font-semibold text-white">{label}<span className="ml-2 text-xs font-normal text-silver-400">(optional)</span></label>
    <input ref={input} id={id} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} aria-describedby={`${id}-help`} className="w-full rounded-lg border border-navy-700 bg-navy-900/50 p-3 text-sm text-white file:mr-3 file:rounded file:border-0 file:bg-amber-300 file:px-3 file:py-2 file:font-semibold file:text-navy-950" onChange={async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const request = ++version.current;
      setBusy(true); onBusy(true); setError("");
      try {
        const prepared = await prepareImage(file, pictureKey);
        if (version.current !== request) return;
        setImage(pictureKey, prepared); onChange(UPLOAD_SELECTED);
      } catch (error) {
        if (version.current === request) setError(error instanceof Error ? error.message : "Could not process this image.");
      } finally {
        if (version.current === request) { setBusy(false); onBusy(false); }
        if (input.current) input.current.value = "";
      }
    }} />
    <p id={`${id}-help`} className="mt-2 text-xs text-navy-200">JPEG, PNG or WebP, up to 5 MB. Photos are resized and sent when you Submit. Reselect photos after refreshing.</p>
    {busy && <p role="status" className="mt-2 text-sm text-amber-200">Preparing photo…</p>}
    {error && <p role="alert" className="mt-2 text-sm text-red-300">{error}</p>}
    {selected && !image && <p role="alert" className="mt-2 text-sm text-amber-200">Please reselect this photo after refresh, or remove it.</p>}
    {image && <img src={`data:${image.fileType};base64,${image.base64}`} alt={`${label} preview`} className="mt-3 max-h-64 w-full rounded-xl border border-navy-700 object-contain" />}
    {(image || selected) && <button type="button" disabled={busy} className="mt-3 rounded-lg border border-navy-600 px-4 py-2 text-sm text-white hover:bg-navy-800" onClick={() => { version.current++; setImage(pictureKey); onChange(""); setError(""); if (input.current) input.current.value = ""; }}>Remove {label.toLowerCase()}</button>}
  </div>;
}
