"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BlogGenRender_1 = __importDefault(require("../services/BlogGenRender/BlogGenRender"));
const BlogGenPluginMapPage = async ({ nodes, parsedFiles, siteMeta, }) => {
    const parsedFileMap = (parsedFile) => ({
        title: parsedFile.title,
        url: parsedFile.relativeUrlPath,
        buildPath: parsedFile.buildPath,
        isDisplayedInMenu: true,
        renderBody: async (renderParameters) => {
            return (0, BlogGenRender_1.default)({
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
exports.default = BlogGenPluginMapPage;
