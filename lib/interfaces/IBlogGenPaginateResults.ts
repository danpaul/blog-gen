import { IBlogGenParsedFile } from "./IBlogGenParsedFile";

export default interface IBlogGenPaginateResults {
  posts: IBlogGenParsedFile[];
  currentPage: Number;
  currentPageUrl: string;
  nextPageUrl?: string;
  previousPageUrl?: string;
  buildPath: string;
}
