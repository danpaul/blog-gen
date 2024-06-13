import IBlogGenPaginateResults from "../interfaces/IBlogGenPaginateResults";
import BlogGenPaginate from "../services/BlogGenPaginate";
import IBlogGenPageNodeGen from "../interfaces/IBlogGenPageNodeGen";
import BlogGenRender from "../services/BlogGenRender/BlogGenRender";
import IBlogGenPageNode from "../interfaces/IBlogGenPageNode";
import IBlogGenRenderParameters from "../interfaces/IBlogGenRenderParameters";

const BlogGenPluginMapBlog = async ({
  nodes,
  parsedFiles,
  siteMeta,
  options,
}: IBlogGenPageNodeGen): Promise<IBlogGenPageNode[]> => {
  const paginatedResults: IBlogGenPaginateResults[] = await BlogGenPaginate({
    sortedParsedFiles: parsedFiles,
    options,
  });

  return [
    ...nodes,
    ...paginatedResults.map((paginatedResult) => ({
      title: "",
      url: paginatedResult.currentPageUrl,
      buildPath: paginatedResult.buildPath,
      isDisplayedInMenu: false,
      renderBody: async (renderParameters: IBlogGenRenderParameters) => {
        return BlogGenRender({
          ...renderParameters,
          paginatedResult,
          siteMeta,
        });
      },
      children: [],
    })),
  ];
};

export default BlogGenPluginMapBlog;
