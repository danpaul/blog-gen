import * as path from "path";
import {
  BlogGenOptionsType,
  BlogGenOptionsOptionalType,
} from "./TypesInterfaces/OptionsTypes";

const fs = require("fs-extra");

const OPTIONS_FILE = "bloggen.json";

const getDefaultOptions = (): BlogGenOptionsType => ({
  site: {
    title: "",
    description: "",
    author: "",
    keywords: [],
  },
  build: {
    contentRoot: "",
    distRoot: "",
    itemsPerPage: 10,
  },
});

export const GetBlogGenOptions = async (
  optionsIn?: BlogGenOptionsOptionalType
): Promise<BlogGenOptionsType> => {
  const options: BlogGenOptionsType = getDefaultOptions();

  options.build.contentRoot = optionsIn?.build?.contentRoot || process.cwd();
  options.build.distRoot =
    optionsIn?.build?.distRoot ||
    path.normalize(`${options.build.contentRoot}/dist`);
  const jsonPath = path.normalize(
    `${options.build.contentRoot}/${OPTIONS_FILE}`
  );

  let jsonData: any = {};
  if (await fs.exists(jsonPath)) {
    try {
      const fileData = (await fs.readFile(jsonPath)).toString();
      jsonData = JSON.parse(fileData);
    } catch (error) {
      console.error(error);
    }
  }

  Object.keys(options).forEach((optionType) => {
    // @ts-ignore
    Object.keys(options[optionType]).forEach((option) => {
      const jsonValue = jsonData?.[optionType]?.[option];
      // @ts-ignore
      const optionsInValue = optionsIn?.[optionType]?.[option];
      if (optionsInValue) {
        // @ts-ignore
        options[optionType][option] = optionsInValue;
      } else if (jsonValue) {
        // @ts-ignore
        options[optionType][option] = jsonValue;
      }
    });
  });

  return options;
};
