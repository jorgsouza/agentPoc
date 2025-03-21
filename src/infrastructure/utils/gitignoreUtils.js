import fs from "fs";
import path from "path";
import ignore from "ignore";

/**
 * Loads and parses the `.gitignore` file to determine ignored patterns.
 * @param {string} rootDirectory - The root directory to search for `.gitignore`.
 * @returns {object} - An ignore instance with loaded patterns.
 */
export function loadGitignore(rootDirectory = ".") {
  const gitignorePath = path.join(rootDirectory, ".gitignore");
  const ig = ignore();

  if (fs.existsSync(gitignorePath)) {
    const patterns = fs
      .readFileSync(gitignorePath, "utf-8")
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"));
    ig.add(patterns);
  }

  // Add default patterns
  ig.add([".git", "node_modules"]);
  return ig;
}
