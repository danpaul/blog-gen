"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const constants_1 = __importDefault(require("../constants"));
const BlogGenGetSiteMeta = async ({ options, }) => {
    const siteMeta = {
        title: "",
    };
    const filePath = `${options.contentRoot}/${constants_1.default.siteMetaFileName}`;
    if ((0, fs_extra_1.pathExists)(filePath)) {
        try {
            const fileString = await (0, fs_extra_1.readFile)(filePath, "utf-8");
            const jsonData = JSON.parse(fileString);
            if (typeof jsonData.title == "string") {
                siteMeta.title = jsonData.title;
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    return siteMeta;
};
exports.default = BlogGenGetSiteMeta;
