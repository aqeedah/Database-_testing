import PersistenceService from "./persistenceService";
import fs from "fs";
import path from "path";

export default class FlatfilePersistence implements PersistenceService {
  constructor() {
    if (!fs.existsSync(this.getPath("flatfileDb"))) {
      fs.mkdirSync(this.getPath("flatfileDb"));
    }
  }

  async create<T>(entity: string, data: T): Promise<T> {
    const filePath = this.getPath("flatfileDb", `${entity}.json`);
    const content = this.readFile(filePath);
    content.push(data);
    this.writeFile(filePath, content);
    return data;
  }

  async read<T>(entity: string, id: string): Promise<T | null> {
    const filePath = this.getPath("flatfileDb", `${entity}.json`);
    const content = this.readFile(filePath);
    return content.find((item: any) => item.id === parseInt(id)) || null;
  }

  async update<T>(entity: string, id: string, data: Partial<T>): Promise<T | null> {
    const filePath = this.getPath("flatfileDb", `${entity}.json`);
    const content = this.readFile(filePath);
    const index = content.findIndex((item: any) => item.id === parseInt(id));
    if (index !== -1) {
      content[index] = { ...content[index], ...data };
      this.writeFile(filePath, content);
      return content[index];
    }
    return null;
  }

  async delete<T>(entity: string, id: string): Promise<boolean> {
    const filePath = this.getPath("flatfileDb", `${entity}.json`);
    const content = this.readFile(filePath);
    const index = content.findIndex((item: any) => item.id === parseInt(id));
    if (index !== -1) {
      content.splice(index, 1);
      this.writeFile(filePath, content);
      return true;
    }
    return false;
  }

  private getPath(...dir: string[]) {
    return path.join(__dirname, ...dir);
  }

  private readFile(filePath: string): any[] {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      return fileContent ? JSON.parse(fileContent) : [];
    }
    return [];
  }

  private writeFile(filePath: string, data: any[]): void {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
}
