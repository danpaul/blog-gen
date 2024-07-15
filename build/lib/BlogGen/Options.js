"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBlogGenOptions = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
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
const GetBlogGenOptions = async ({ contentRoot, distRoot, } = {}) => {
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
exports.GetBlogGenOptions = GetBlogGenOptions;
