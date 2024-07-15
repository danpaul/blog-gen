"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BlogGen_1 = __importDefault(require("../lib/BlogGen/BlogGen"));
const express = require("express");
const CONTENT_ROOT = __dirname + "/blog";
const DIST_ROOT = __dirname + "/dist";
const ITEMS_PER_PAGE = 1;
(async () => {
    const blogGen = new BlogGen_1.default({
        site: { title: "my site", description: "", author: "", keywords: [] },
        build: {
            contentRoot: CONTENT_ROOT,
            distRoot: DIST_ROOT,
            itemsPerPage: ITEMS_PER_PAGE,
        },
    });
    await blogGen.run();
    const app = express();
    const port = 3000;
    app.use(express.static(DIST_ROOT));
    app.listen(port, () => {
        console.log(`Serving site on: ${port}`);
    });
    console.log("success!");
})();
