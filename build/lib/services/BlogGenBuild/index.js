"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const BlogGenRenderMenu_1 = __importDefault(require("../BlogGenRender/BlogGenRenderMenu"));
const BlogGenBuild = async ({ pageNodes, siteMeta, }) => {
    const renderMenu = (0, BlogGenRenderMenu_1.default)({ pageNodes, siteMeta });
    Promise.all(pageNodes.map(async (pageNode) => {
        const html = await pageNode.renderBody({
            renderMenu,
        });
        await (0, fs_extra_1.writeFile)(pageNode.buildPath, html);
    }));
};
exports.default = BlogGenBuild;
