// Padrão visual de imagens de produto: 4:5 (1200x1500), sem cortes.
// A imagem é redimensionada para caber inteira e centralizada sobre um fundo claro.

export const PRODUCT_IMAGE_WIDTH = 1200;
export const PRODUCT_IMAGE_HEIGHT = 1500;
export const PRODUCT_IMAGE_RATIO_LABEL = "4:5 (1200 × 1500 px)";

const BACKGROUND = "#f6f2ec";

export async function normalizeProductImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = PRODUCT_IMAGE_WIDTH;
    canvas.height = PRODUCT_IMAGE_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // "contain" — a foto inteira aparece, nada é cortado
    const scale = Math.min(
      canvas.width / bitmap.width,
      canvas.height / bitmap.height
    );
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    ctx.drawImage(
      bitmap,
      Math.round((canvas.width - w) / 2),
      Math.round((canvas.height - h) / 2),
      w,
      h
    );
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92)
    );
    if (!blob) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + "-1200x1500.jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
