const fs = require("fs");
import * as path from "path";

const OPTIONS_FILE = "bloggen.json";

export type BlogGenSiteOptionsType = {
  title: string;
  description: string;
  author: string;
  keywords: string[];
};

export type BlogGenBuildOptionsType = {
  contentRoot: string;
  distRoot: string;
  itemsPerPage: number;
};

export type BlogGenOptionsType = {
  site: BlogGenSiteOptionsType;
  build: BlogGenBuildOptionsType;
};

const defaultBuildOptions = (): BlogGenBuildOptionsType => ({
  contentRoot: "",
  distRoot: "",
  itemsPerPage: 10,
});

const defaultSiteOptions = (): BlogGenSiteOptionsType => ({
  title: "",
  description: "",
  author: "",
  keywords: [],
});

export const GetBlogGenOptions = async ({
  contentRoot,
  distRoot,
}: {
  contentRoot?: string;
  distRoot?: string;
} = {}): Promise<BlogGenOptionsType> => {
  const options: BlogGenOptionsType = {
    site: defaultSiteOptions(),
    build: defaultBuildOptions(),
  };

  options.build.contentRoot = contentRoot || process.cwd();
  options.build.distRoot =
    distRoot || path.normalize(`${options.build.contentRoot}/dist`);
  const jsonPath = path.normalize(
    `${options.build.contentRoot}/${OPTIONS_FILE}`
  );

  let jsonData: any = {};
  if (await fs.exists(jsonPath)) {
    try {
      const fileData = (await fs.readFileSync(jsonPath)).toString();
      jsonData = JSON.parse(fileData);
    } catch (error) {
      console.error(error);
    }
  }

  Object.keys(options).forEach((optionType) => {
    // @ts-ignore
    Object.keys(options[optionType]).forEach((option) => {
      const jsonValue = jsonData?.[optionType]?.[option];
      if (jsonValue) {
        // @ts-ignore
        options[optionType][option] = jsonValue;
      }
    });
  });

  return options;
};
