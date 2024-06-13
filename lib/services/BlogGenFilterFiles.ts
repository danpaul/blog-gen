import { Dirent } from "node:fs";
import * as path from "path";

export interface IBlogGenFilterFiles {
  files: Dirent[];
  filters?: {
    (f: Dirent): boolean;
  }[];
  hooks?: {
    (f: Dirent): boolean;
  }[];
}

const BlogGenHookIsMarkdownFile = (f: Dirent) =>
  f.isFile() && path.extname(f.name).toLowerCase() == ".md";

const BlogGenHookIsPublicFile = (f: Dirent) => f.name[0] && f.name[0] !== "_";

const BlogGenHooks = [BlogGenHookIsMarkdownFile, BlogGenHookIsPublicFile];

const BlogGenFilterFiles = ({ files, filters, hooks }: IBlogGenFilterFiles) => {
  return files.filter((file) => {
    let valid = true;
    [...(hooks ? hooks : BlogGenHooks), ...(filters ? filters : [])].forEach(
      (filter) => {
        if (!filter(file)) {
          valid = false;
        }
      }
    );
    return valid;
  });
};

export default BlogGenFilterFiles;
