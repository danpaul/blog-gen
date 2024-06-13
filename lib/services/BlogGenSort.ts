import { IBlogGenParsedFile } from "../interfaces/IBlogGenParsedFile";
import { IBlogGenSortedParsedFiles } from "../interfaces/IBlogGenSortedParsedFiles";

const BlogGenSort = ({
  files,
}: {
  files: IBlogGenParsedFile[];
}): IBlogGenSortedParsedFiles => {
  const sorted = {
    pages: [],
    posts: [],
  };

  files.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
  files.forEach((f) => {
    if (f.type == "page") {
      sorted.pages.push(f);
    } else {
      sorted.posts.push(f);
    }
  });

  return sorted;
};

export default BlogGenSort;
