export interface FileRequest {
  filePath: string;
  fileName: string;
  fileMimeType: string;
  outputFormat: string | string[];
  outputPath: string;
}
