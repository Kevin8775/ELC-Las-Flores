import multer from "multer";
import { imagekit } from "./imagekit";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Solo se permiten imágenes"));
  },
});

export async function uploadToImageKit(
  file: Express.Multer.File,
  folder: string
): Promise<string> {
  const b64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await imagekit.files.upload({
    file: b64,
    fileName: `${Date.now()}_${file.originalname}`,
    folder,
    useUniqueFileName: true,
  });
  return result.url!;
}
