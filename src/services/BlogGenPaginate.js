import * as path from "path";
import constants from "../constants";
const buildUrl = (pageNumber) => {
    return pageNumber == 1 ? "index.html" : `${pageNumber}.html`;
};
const BlogGenPaginate = async ({ sortedParsedFiles, options, }) => {
    const { paginateResultsPerPage } = constants;
    const numberOfPages = Math.ceil(sortedParsedFiles.posts.length / paginateResultsPerPage);
    const paginatedItems = [];
    for (let i = 1; i <= numberOfPages; i++) {
        paginatedItems.push({
            currentPage: i,
            currentPageUrl: buildUrl(i),
            previousPageUrl: i > 1 ? buildUrl(i - 1) : null,
            nextPageUrl: i < numberOfPages ? buildUrl(i + 1) : null,
            posts: sortedParsedFiles.posts.slice((i - 1) * paginateResultsPerPage, paginateResultsPerPage * i),
            buildPath: path.normalize(`${options.distRoot}/${buildUrl(i)}`),
        });
    }
    return paginatedItems;
};
export default BlogGenPaginate;
