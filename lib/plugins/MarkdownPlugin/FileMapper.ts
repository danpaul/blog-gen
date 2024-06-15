import { Dirent } from "fs-extra";
import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import * as path from "path";
import { ContentItemFile } from "./ContentItemFile";

export class FileMapper {
  private files: Dirent[];
  private contentRoot: string;
  constructor({
    files,
    contentRoot,
  }: {
    files: Dirent[];
    contentRoot: string;
  }) {
    this.files = files;
    this.contentRoot = contentRoot;
  }
  async mapFiles(): Promise<ContentItemsInterface[]> {
    return Promise.all(
      this.files.filter(this.filter.bind(this)).map(
        async (f) =>
          await new ContentItemFile({
            file: f,
            contentRoot: this.contentRoot,
          })
      )
    );
  }

  private filter(f: Dirent) {
    return this.isMarkdownFile(f) && this.isPublicFile(f);
  }

  private isMarkdownFile(f: Dirent) {
    return f.isFile() && path.extname(f.name).toLowerCase() == ".md";
  }

  private isPublicFile(f: Dirent) {
    return f.name[0] && f.name[0] !== "_";
  }
}
