import * as fs from "fs";
import * as path from "path";
import archiver from "archiver";
import { ConversionFileResult } from "../types/FileResults";

export async function createZipFile(
  files: ConversionFileResult[],
  baseFileName: string,
  outputFolder: string
): Promise<string> {
  const zipPath = path.join(outputFolder, `${baseFileName}_converted.zip`);

  await new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve());
    output.on("error", (err) => reject(err));
    archive.on("error", (err) => reject(err));

    archive.pipe(output);

    files.forEach((f) => {
      if (f.success&&fs.existsSync(f.filePath)) {
        archive.file(f.filePath, { name: f.filename });
      }
    });

    archive.finalize();
  });

  return zipPath;
}
