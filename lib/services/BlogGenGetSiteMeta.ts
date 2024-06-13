import IBloGenOptions from "../interfaces/IBlogGenOptions";
import { IBlogGenSiteMeta } from "../interfaces/IBlogGenSiteMeta";
import { pathExists, readFile } from "fs-extra";
import constants from "../constants";

const BlogGenGetSiteMeta = async ({
  options,
}: {
  options: IBloGenOptions;
}): Promise<IBlogGenSiteMeta> => {
  const siteMeta: IBlogGenSiteMeta = {
    title: "",
  };

  const filePath = `${options.contentRoot}/${constants.siteMetaFileName}`;
  if (pathExists(filePath)) {
    try {
      const fileString = await readFile(filePath, "utf-8");
      const jsonData = JSON.parse(fileString);
      if (typeof jsonData.title == "string") {
        siteMeta.title = jsonData.title;
      }
    } catch (error) {
      console.error(error);
    }
  }
  return siteMeta;
};

export default BlogGenGetSiteMeta;
