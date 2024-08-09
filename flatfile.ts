import PersistenceService from "./persistenceService";
import fs from "fs";
import path from "path";

export default class FlatfilePersistence implements PersistenceService {
  constructor() {
    if (!fs.existsSync(this.getPath("flatfileDb"))) {
      fs.mkdirSync(this.getPath("flatfileDb"));
    }
  }

  create(name: string) {
    if (fs.existsSync(this.getPath(`flatfileDb`, `${name}.json`))) {
      return;
    }

    fs.writeFileSync(this.getPath(`flatfileDb`, `${name}.json`), "");
  }

  drop(name: string) {
    const filePath = this.getPath(`flatfileDb`, `${name}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  insert<T = unknown>(content: T, location: string) {
    fs.appendFileSync(
      this.getPath("flatfileDb", `${location}.json`),
      JSON.stringify(content)
    );
  }

  update<T = unknown>(content: T, location: string) {
    const filePath = this.getPath("flatfileDb", `${location}.json`);
    if (fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(content));
    }
  }

  delete<T = unknown>(content: T, location: string) {
    const filePath = this.getPath("flatfileDb", `${location}.json`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(fileContent) as T[];
      const updatedData = data.filter(item => JSON.stringify(item) !== JSON.stringify(content));
      fs.writeFileSync(filePath, JSON.stringify(updatedData));
    }
  } 
 
  private getPath(...dir: string[]) {
    return path.join(__dirname, ...dir);
  }
}

