import * as fs from "fs/promises";
const BlogGenReadFiles = async ({ contentRoot }) => {
    return fs.readdir(contentRoot, { withFileTypes: true });
};
export default BlogGenReadFiles;
