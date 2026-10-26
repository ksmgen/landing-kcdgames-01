import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PictureUpload, SurveyImagesProvider, MAX_IMAGE_BYTES, prepareImage, validateImageFile } from "./surveyImages";

const processed = "/9j/VEVTVC1QSE9UTw==";
function stubDecoder(fail = false) {
  vi.stubGlobal("Image", class {
    naturalWidth = 3200;
    naturalHeight = 2400;
    onload?: () => void;
    onerror?: () => void;
    set src(_value: string) { queueMicrotask(() => fail ? this.onerror?.() : this.onload?.()); }
  });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ fillStyle: "", fillRect: vi.fn(), drawImage: vi.fn() } as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(`data:image/jpeg;base64,${processed}`);
}

describe("real survey photos", () => {
  beforeEach(() => { sessionStorage.clear(); });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it.each(["image/jpeg", "image/png", "image/webp"])("accepts %s within the input size bound", (type) => {
    expect(() => validateImageFile(new File(["TEST"], "photo", { type }))).not.toThrow();
  });
  it("rejects empty, unsupported and oversized inputs", () => {
    expect(() => validateImageFile(new File([], "empty.jpg", { type: "image/jpeg" }))).toThrow(/5 MB/);
    expect(() => validateImageFile(new File(["svg"], "bad.svg", { type: "image/svg+xml" }))).toThrow(/JPEG/);
    expect(() => validateImageFile(new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], "large.jpg", { type: "image/jpeg" }))).toThrow(/5 MB/);
  });
  it("resizes and re-encodes without filenames or metadata in the payload", async () => {
    stubDecoder();
    const image = await prepareImage(new File(["TEST-source"], "private-name.png", { type: "image/png" }), "retailArea");
    expect(image).toEqual({ key: "retailArea", fileType: "image/jpeg", base64: processed });
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledWith("image/jpeg", 0.82);
    const canvas = vi.mocked(HTMLCanvasElement.prototype.toDataURL).mock.instances[0] as unknown as HTMLCanvasElement;
    expect(canvas.width).toBe(1600); expect(canvas.height).toBe(1200);
  });
  it("rejects unreadable image content", async () => {
    stubDecoder(true);
    await expect(prepareImage(new File(["not an image"], "spoof.jpg", { type: "image/jpeg" }), "playArea")).rejects.toThrow(/not a readable image/);
  });
  it("previews, replaces and removes photos without saving bytes in sessionStorage", async () => {
    stubDecoder();
    const onChange = vi.fn(); const onBusy = vi.fn();
    render(<SurveyImagesProvider><PictureUpload pictureKey="retailArea" label="Retail area picture" selected="" onChange={onChange} onBusy={onBusy} /></SurveyImagesProvider>);
    const input = screen.getByLabelText(/retail area picture/i);
    const file = new File(["TEST-image"], "private-name.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => expect(screen.getByAltText(/retail area picture preview/i)).toHaveAttribute("src", `data:image/jpeg;base64,${processed}`));
    expect(onChange).toHaveBeenLastCalledWith("upload-selected");
    expect(onBusy).toHaveBeenLastCalledWith(false);
    expect(sessionStorage.length).toBe(0);
    fireEvent.change(input, { target: { files: [new File(["invalid"], "bad.svg", { type: "image/svg+xml" })] } });
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/JPEG/));
    expect(screen.getByAltText(/preview/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /remove retail area picture/i }));
    expect(screen.queryByAltText(/preview/i)).not.toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith("");
  });
});
