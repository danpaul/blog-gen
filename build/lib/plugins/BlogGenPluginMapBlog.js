import BlogGenPaginate from "../services/BlogGenPaginate";
import BlogGenRender from "../services/BlogGenRender/BlogGenRender";
const BlogGenPluginMapBlog = async ({ nodes, parsedFiles, siteMeta, options, }) => {
    const paginatedResults = await BlogGenPaginate({
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
            renderBody: async (renderParameters) => {
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
