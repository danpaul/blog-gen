import BlogGenRender from "../services/BlogGenRender/BlogGenRender";
const BlogGenPluginMapPage = async ({ nodes, parsedFiles, siteMeta, }) => {
    const parsedFileMap = (parsedFile) => ({
        title: parsedFile.title,
        url: parsedFile.relativeUrlPath,
        buildPath: parsedFile.buildPath,
        isDisplayedInMenu: true,
        renderBody: async (renderParameters) => {
            return BlogGenRender({
                ...renderParameters,
                siteMeta,
                parsedFile,
            });
        },
        children: [],
    });
    return [
        ...nodes,
        ...parsedFiles.pages.map((p) => parsedFileMap(p)),
        ...parsedFiles.posts.map((p) => parsedFileMap(p)),
    ];
};
export default BlogGenPluginMapPage;
