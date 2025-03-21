import fs from "fs";
import path from "path";
import ignore from "ignore";
import { loadGitignore } from "../../config/gitignoreUtils.js";

export class FileRepository {
  constructor() {
    this.ignorePatterns = loadGitignore();
  }

  listFiles(directory = ".") {
    const fileList = [];
    
    function traverse(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(".", fullPath).replace(/\\/g, "/");

        if (this.ignorePatterns.ignores(relativePath)) continue;

        if (entry.isDirectory()) {
          traverse.call(this, fullPath);
        } else {
          fileList.push(relativePath);
        }
      }
    }

    traverse.call(this, directory);
    return fileList;
  }

  readFile(filePath) {
    return fs.readFileSync(filePath, "utf-8");
  }
}
