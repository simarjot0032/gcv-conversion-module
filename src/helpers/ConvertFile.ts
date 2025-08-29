import { FileRequest } from "../types/FileRequest";
import { ValidateFile } from "./ValidateFile";
import * as path from "path";
import * as fs from "fs";
import { spawn } from "child_process";
import { ConversionFileResult } from "../types/FileResults";
import { createZipFile } from "./ZipFile";

export const ConvertFile = async (file: FileRequest) => {
  const validationResults = ValidateFile(file);
  if (!validationResults.success) {
    return { success: false as const, error: validationResults.error };
  }

  const fileExtension = file.fileName.split(".").pop() || "";
  const fileNameWithoutExt = path.basename(file.fileName, `.${fileExtension}`);
  const outputFormats = Array.isArray(file.outputFormat)
    ? file.outputFormat
    : [file.outputFormat];
  fs.mkdirSync(file.outputPath, { recursive: true });
  const conversionPromises = outputFormats.map((format) => {
    const outputPath = path.join(
      file.outputPath,
      `${fileNameWithoutExt}.${format}`
    );

    return new Promise<ConversionFileResult>((resolve, reject) => {
      const gcv = spawn("gcv", [file.filePath, outputPath]);

      let stderr = "";
      gcv.stderr.on("data", (data) => (stderr += data.toString()));

      gcv.on("error", (error) => {
        reject(
          new Error(`Failed to start gcv for ${format}: ${error.message}`)
        );
      });

      gcv.on("close", (code) => {
        if (code === 0 && fs.existsSync(outputPath)) {
          resolve({
            success: true as const,
            filePath: outputPath,
            filename: `${fileNameWithoutExt}.${format}`,
          });
        } else {
          reject(new Error(`gcv failed for ${format}: ${stderr}`));
        }
      });
    });
  });
  try {
    const convertedFiles = await Promise.all(conversionPromises);

    if (convertedFiles.length === 1 && convertedFiles[0].success) {
      const outputFormat = outputFormats[0];
      return {
        success: true as const,
        filePath: convertedFiles[0].filePath,
        filename: `${fileNameWithoutExt}.${outputFormat}`,
      };
    }

    const zipPath = await createZipFile(
      convertedFiles,
      fileNameWithoutExt,
      file.outputPath
    );
    if (
      zipPath &&
      convertedFiles.length > 1 &&
      convertedFiles.some((f) => f.success)
    ) {
      return {
        success: true as const,
        filePath: zipPath,
        filename: `${fileNameWithoutExt}.zip`,
      };
    }
  } catch (err: any) {
    return { success: false as const, error: err.message };
  }
};
