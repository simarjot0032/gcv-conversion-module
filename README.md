
# 📦 OGV Conversation Package

A lightweight Node.js/TypeScript utility to validate, convert, and zip 3D model files using the **BRL-CAD `gcv` tool**.
This package is designed for use in backend frameworks like **NestJS** or **Express**.

---

## 🚀 Installation

Since this package is hosted only on GitHub, you can install it directly:

```bash
npm install https://github.com/simarjot0032/ogv-conversation-package.git
```

or with Yarn:

```bash
yarn add https://github.com/simarjot0032/ogv-conversation-package.git
```

> ⚠️ Make sure you have [BRL-CAD](https://github.com/BRL-CAD/brlcad/releases) installed and accessible in your system’s `$PATH`, because the package calls `gcv` under the hood.

---

## ⚙️ Requirements

- Before using this package, make sure you have:

    - Node.js ≥ 18 (recommended Node  20+).

    - Yarn or npm installed for package management.

    - BRL-CAD installed on your system.

    - gcv (Geometry Conversion tool) must be available in your PATH.

- Verify installation with:

    ```gcv --version```

A backend environment like NestJS or Express (this package is not designed for frontend/browser use).

Permissions to read/write in the configured input and output directories (the package will create them if missing).

## 📖 Usage

### 1. Import into your backend project

```ts
import { ConvertFile, FileRequest, ConversionFileResult } from 'ogv-conversation-package';
```

### 2. Create a request object

You’ll need to pass details about the file you want to convert:

```ts
const fileRequest: FileRequest = {
  filePath: 'uploads/conversion-api/inputs/example.obj',   // absolute or relative path to file
  fileName: 'example.obj',                                // original file name
  fileMimeType: 'application/octet-stream',               // MIME type of the input
  outputFormat: ['g'],                             // one or multiple formats
  outputPath: 'uploads/conversion-api/outputs',           // folder where converted files will be written
};
```

### 3. Call the converter

```ts
const result: ConversionFileResult = await ConvertFile(fileRequest);

if (result.success) {
  console.log('✅ File converted at:', result.filePath);
  console.log('📄 Output filename:', result.filename);
} else {
  console.error('❌ Conversion failed:', result.error);
}
```

---

## 🎯 Features

* Validate input file name, extension, and MIME type.
* Convert to **single or multiple formats**.
* Automatically creates a **zip file** if multiple outputs are requested.
* Returns typed results (`success` / `error`).

---

## 📂 Example in NestJS Service

```ts
import { Injectable } from '@nestjs/common';
import { ConvertFile, FileRequest, ConversionFileResult } from 'ogv-conversation-package';
import { StorageConfig } from 'src/config/storage.config';

@Injectable()
export class ConverterService {
  async convertToMultipleFormats(file: Express.Multer.File, outputFormats: string[]): Promise<ConversionFileResult> {
    const fileRequest: FileRequest = {
      filePath: file.path,
      fileName: file.originalname,
      fileMimeType: file.mimetype,
      outputFormat: outputFormats,
      outputPath: StorageConfig.CONVERTER_OUTPUT_PATH,
    };

    return await ConvertFile(fileRequest);
  }
}
```

---
## Supported Input Formats
``` obj, stl, ply, vrml, 3mf, asc, x, x3d, 3ds, dae, fbx, json, assbin, g```
## Supported Output Formats
```obj, stl, ply, vrml, 3mf, asc, x, x3d, 3ds, dae, fbx, json, assbin, g ```
## Supproted MIME Types
| Extension | MIME Type                |
| --------- | ------------------------ |
| obj       | model/obj                |
| stl       | model/stl                |
| ply       | application/octet-stream |
| vrml      | model/vrml               |
| 3mf       | model/3mf                |
| asc       | application/pgp-keys     |
| x         | application/octet-stream |
| x3d       | model/x3d+xml            |
| 3ds       | image/x-3ds              |
| dae       | model/vnd.collada+xml    |
| fbx       | application/x-fbx        |
| json      | application/json         |
| assbin    | application/octet-stream |
| g         | application/octet-stream |

## ⚠️ Notes
* **Input validation:** The package checks both file extension and MIME type against supported formats.
* **Preferred request format:** In JSON body, send `outputFormat` as an array:
  ```json
  { "outputFormat": ["stl", "g"] }
  ```

* **Temporary files:** Cleanup of input/output files should be handled by your application after usage.

---
