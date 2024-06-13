import IBlogGenPageNode from "../../interfaces/IBlogGenPageNode";
import { writeFile } from "fs-extra";
import BlogGenRenderMenu from "../BlogGenRender/BlogGenRenderMenu";
import { IBlogGenSiteMeta } from "../../interfaces/IBlogGenSiteMeta";

const BlogGenBuild = async ({
  pageNodes,
  siteMeta,
}: {
  pageNodes: IBlogGenPageNode[];
  siteMeta: IBlogGenSiteMeta;
}) => {
  const renderMenu = BlogGenRenderMenu({ pageNodes, siteMeta });
  Promise.all(
    pageNodes.map(async (pageNode) => {
      const html: string = await pageNode.renderBody({
        renderMenu,
      });
      await writeFile(pageNode.buildPath, html);
    })
  );
};

export default BlogGenBuild;
