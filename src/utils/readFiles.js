import fs from "fs";

export function readJsonFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export function readXmlFile(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}
