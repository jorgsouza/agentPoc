import fs from "fs";
import path from "path";

class CodeAnalysis {
  constructor(repository) {
    this.repository = repository;
  }

  listFiles(directory) {
    return this.repository.listFiles(directory);
  }

  readFileContent(fileName, directory) {
    return this.repository.readFileContent(fileName, directory);
  }
}

export { CodeAnalysis };
