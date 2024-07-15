"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const constants_1 = __importDefault(require("../constants"));
const BlogGenInitDirs = async ({ distRoot }) => {
    await (0, fs_extra_1.ensureDir)(distRoot);
    await (0, fs_extra_1.emptyDir)(distRoot);
    await (0, fs_extra_1.ensureDir)(distRoot + constants_1.default.assetPath);
};
exports.default = BlogGenInitDirs;
