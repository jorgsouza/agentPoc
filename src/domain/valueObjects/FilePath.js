import path from "path";

export class FilePath {
  constructor(filePath) {
    if (!filePath || typeof filePath !== "string") {
      throw new Error("Invalid file path");
    }
    this.filePath = path.normalize(filePath);
  }

  toString() {
    return this.filePath;
  }
}
