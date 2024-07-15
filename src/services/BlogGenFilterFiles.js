import * as path from "path";
const BlogGenHookIsMarkdownFile = (f) => f.isFile() && path.extname(f.name).toLowerCase() == ".md";
const BlogGenHookIsPublicFile = (f) => f.name[0] && f.name[0] !== "_";
const BlogGenHooks = [BlogGenHookIsMarkdownFile, BlogGenHookIsPublicFile];
const BlogGenFilterFiles = ({ files, filters, hooks }) => {
    return files.filter((file) => {
        let valid = true;
        [...(hooks ? hooks : BlogGenHooks), ...(filters ? filters : [])].forEach((filter) => {
            if (!filter(file)) {
                valid = false;
            }
        });
        return valid;
    });
};
export default BlogGenFilterFiles;
