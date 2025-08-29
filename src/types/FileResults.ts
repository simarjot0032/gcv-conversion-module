export interface FileValidationResults {
  success: boolean;
  error?: string;
}
export type ConversionFileResult =
  | {
      success: true;
      filePath: string;
      filename: string;
    }
  | {
      success: false;
      error: string;
    };
