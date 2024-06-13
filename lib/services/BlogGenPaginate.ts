import * as path from "path";

import IBlogGenPaginateResults from "../interfaces/IBlogGenPaginateResults";
import { IBlogGenSortedParsedFiles } from "../interfaces/IBlogGenSortedParsedFiles";
import constants from "../constants";
import IBloGenOptions from "../interfaces/IBlogGenOptions";

interface IBlogGenPaginate {
  sortedParsedFiles: IBlogGenSortedParsedFiles;
  options: IBloGenOptions;
}

const buildUrl = (pageNumber: Number) => {
  return pageNumber == 1 ? "index.html" : `${pageNumber}.html`;
};

const BlogGenPaginate = async ({
  sortedParsedFiles,
  options,
}: IBlogGenPaginate): Promise<IBlogGenPaginateResults[]> => {
  const { paginateResultsPerPage } = constants;

  const numberOfPages = Math.ceil(
    sortedParsedFiles.posts.length / paginateResultsPerPage
  );
  const paginatedItems: IBlogGenPaginateResults[] = [];
  for (let i = 1; i <= numberOfPages; i++) {
    paginatedItems.push({
      currentPage: i,
      currentPageUrl: buildUrl(i),
      previousPageUrl: i > 1 ? buildUrl(i - 1) : null,
      nextPageUrl: i < numberOfPages ? buildUrl(i + 1) : null,
      posts: sortedParsedFiles.posts.slice(
        (i - 1) * paginateResultsPerPage,
        paginateResultsPerPage * i
      ),
      buildPath: path.normalize(`${options.distRoot}/${buildUrl(i)}`),
    });
  }
  return paginatedItems;
};

export default BlogGenPaginate;
