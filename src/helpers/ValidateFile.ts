import { InputFormats, OutputFormats } from "../types/FileFormats";
import { FileRequest } from "../types/FileRequest";
import { FileValidationResults } from "../types/FileResults";

export const ValidateFile = (file: FileRequest): FileValidationResults => {
  const fileExtension = file.fileName.toLowerCase().split(".").pop() || "";

  if (!file.filePath) {
    return {
      success: false,
      error: "File path is required",
    };
  }
  if (!file.fileName) {
    return {
      success: false,
      error: "File name is required",
    };
  }
  if (!file.outputPath) {
    return {
      success: false,
      error: "Output path is required",
    };
  }
  if (!file.outputFormat || file.outputFormat.length === 0) {
    return {
      success: false,
      error: "Output format is required",
    };
  }
  if (!InputFormats.includes(fileExtension)) {
    return {
      success: false,
      error: "Invalid file extension",
    };
  }
  const outputFormats = Array.isArray(file.outputFormat)
    ? file.outputFormat
    : [file.outputFormat];

  const uniqueFormats = new Set(outputFormats);
  if (uniqueFormats.size !== outputFormats.length) {
    return {
      success: false,
      error: "Duplicate output formats are not allowed",
    };
  }

  for (const format of outputFormats) {
    if (fileExtension === format) {
      return {
        success: false,
        error: `Input and output format cannot be the same: ${format}`,
      };
    }
    if (!OutputFormats.includes(format)) {
      return {
        success: false,
        error: `Output format not supported: ${format}. Supported formats: ${OutputFormats.join(
          ", "
        )}`,
      };
    }
  }

  return {
    success: true,
  };
};
