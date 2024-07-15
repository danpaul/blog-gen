"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BlogGenPaginate_1 = __importDefault(require("../services/BlogGenPaginate"));
const BlogGenRender_1 = __importDefault(require("../services/BlogGenRender/BlogGenRender"));
const BlogGenPluginMapBlog = async ({ nodes, parsedFiles, siteMeta, options, }) => {
    const paginatedResults = await (0, BlogGenPaginate_1.default)({
        sortedParsedFiles: parsedFiles,
        options,
    });
    return [
        ...nodes,
        ...paginatedResults.map((paginatedResult) => ({
            title: "",
            url: paginatedResult.currentPageUrl,
            buildPath: paginatedResult.buildPath,
            isDisplayedInMenu: false,
            renderBody: async (renderParameters) => {
                return (0, BlogGenRender_1.default)({
                    ...renderParameters,
                    paginatedResult,
                    siteMeta,
                });
            },
            children: [],
        })),
    ];
};
exports.default = BlogGenPluginMapBlog;
