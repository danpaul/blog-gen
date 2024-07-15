import BlogGenRender from "../services/BlogGenRender/BlogGenRender";
import IBlogGenPageNodeGen from "../interfaces/IBlogGenPageNodeGen";
import IBlogGenPageNode from "../interfaces/IBlogGenPageNode";
import IBlogGenRenderParameters from "../interfaces/IBlogGenRenderParameters";

const BlogGenPluginMapPage = async ({
  nodes,
  parsedFiles,
  siteMeta,
}: IBlogGenPageNodeGen): Promise<IBlogGenPageNode[]> => {
  const parsedFileMap = (parsedFile) => ({
    title: parsedFile.title,
    url: parsedFile.relativeUrlPath,
    buildPath: parsedFile.buildPath,
    isDisplayedInMenu: true,
    renderBody: async (renderParameters: IBlogGenRenderParameters) => {
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
