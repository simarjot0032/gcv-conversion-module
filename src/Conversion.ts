import { FileRequestInput } from "./types/FileRequestInput";
import { InputFormats, OutputFormats } from "./types/FileProperties";

export async function ConvertFile({ file, outputFormat }: FileRequestInput) {
  try {
    if (!file) {
      return {
        success: false,
        message: "File is required",
      };
    }
    OutputFormats.forEach((format) => {
      if (!outputFormat.includes(format)) {
        return {
          success: false,
          message: `${format} is not supported`,
        };
      }
    });

    if (!file.name || file.size === 0) {
      return {
        success: false,
        message: "Invalid file: file must have a name and non-zero size",
      };
    }
    const inputFormat = file.name.split(".").pop() as string;
    if (!InputFormats.includes(inputFormat)) {
      return {
        success: false,
        message: "Input format is not supported",
      };
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("outputFormat", JSON.stringify(outputFormat));

    const API_URL = "https://ogv-1.onrender.com/converter/upload/";

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.blob();
      const url = URL.createObjectURL(data);
      const filename = file.name.split(".").slice(0, -1).join(".");
      const downloadFileName =
        outputFormat.length > 1
          ? `${filename}.zip`
          : `${filename}.${outputFormat[0]}`;

      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFileName;
      a.click();
      a.remove();
      return {
        success: true,
        url: url,
        message: "File converted successfully",
      };
    } else {
      return {
        success: false,
        message: "Failed to convert file",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to convert file",
    };
  }
}
