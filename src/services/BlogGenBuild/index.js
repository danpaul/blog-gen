import { writeFile } from "fs-extra";
import BlogGenRenderMenu from "../BlogGenRender/BlogGenRenderMenu";
const BlogGenBuild = async ({ pageNodes, siteMeta, }) => {
    const renderMenu = BlogGenRenderMenu({ pageNodes, siteMeta });
    Promise.all(pageNodes.map(async (pageNode) => {
        const html = await pageNode.renderBody({
            renderMenu,
        });
        await writeFile(pageNode.buildPath, html);
    }));
};
export default BlogGenBuild;
