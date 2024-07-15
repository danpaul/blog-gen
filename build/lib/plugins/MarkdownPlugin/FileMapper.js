import * as path from "path";
import { ContentItemFile } from "./ContentItemFile";
export class FileMapper {
    constructor({ files, contentRoot, }) {
        this.files = files;
        this.contentRoot = contentRoot;
    }
    async mapFiles() {
        return Promise.all(this.files.filter(this.filter.bind(this)).map(async (f) => await new ContentItemFile({
            file: f,
            contentRoot: this.contentRoot,
        })));
    }
    filter(f) {
        return this.isMarkdownFile(f) && this.isPublicFile(f);
    }
    isMarkdownFile(f) {
        return f.isFile() && path.extname(f.name).toLowerCase() == ".md";
    }
    isPublicFile(f) {
        return f.name[0] && f.name[0] !== "_";
    }
}
