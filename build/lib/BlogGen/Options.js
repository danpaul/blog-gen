import * as fs from "fs-extra";
import * as path from "path";
const OPTIONS_FILE = "bloggen.json";
const defaultBuildOptions = () => ({
    contentRoot: "",
    distRoot: "",
    itemsPerPage: 10,
});
const defaultSiteOptions = () => ({
    title: "",
    description: "",
    author: "",
    keywords: [],
});
export const GetBlogGenOptions = async ({ contentRoot, distRoot, } = {}) => {
    const options = {
        site: defaultSiteOptions(),
        build: defaultBuildOptions(),
    };
    options.build.contentRoot = contentRoot || process.cwd();
    options.build.distRoot =
        distRoot || path.normalize(`${options.build.contentRoot}/dist`);
    const jsonPath = path.normalize(`${options.build.contentRoot}/${OPTIONS_FILE}`);
    let jsonData = {};
    if (await fs.exists(jsonPath)) {
        try {
            const fileData = (await fs.readFile(jsonPath)).toString();
            jsonData = JSON.parse(fileData);
        }
        catch (error) {
            console.error(error);
        }
    }
    Object.keys(options).forEach((optionType) => {
        Object.keys(options[optionType]).forEach((option) => {
            const jsonValue = jsonData?.[optionType]?.[option];
            if (jsonValue) {
                options[optionType][option] = jsonValue;
            }
        });
    });
    return options;
};
