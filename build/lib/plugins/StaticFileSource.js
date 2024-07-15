import * as fs from "fs/promises";
import path from "path";
export default class StaticFileSource {
    constructor({ contentRoot }) {
        this.contentRoot = contentRoot;
    }
    async getItems(contentItems) {
        let files = (await fs.readdir(this.contentRoot, { withFileTypes: true })).filter((f) => this.isMarkdownFile(f) && this.isPublicFile(f));
        return [
            ...contentItems,
            // files
        ];
    }
    isMarkdownFile(f) {
        return f.isFile() && path.extname(f.name).toLowerCase() == ".md";
    }
    isPublicFile(f) {
        return f.name[0] && f.name[0] !== "_";
    }
}
