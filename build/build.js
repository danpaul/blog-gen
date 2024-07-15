"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BlogGen_1 = __importDefault(require("./lib/BlogGen/BlogGen"));
const Options_1 = require("./lib/BlogGen/Options");
const IS_TESTING = false;
const TESTING_DIR = __dirname + "/../test/blog";
(async () => {
    const options = await (0, Options_1.GetBlogGenOptions)(IS_TESTING ? { contentRoot: TESTING_DIR } : null);
    const blogGen = new BlogGen_1.default(options);
    await blogGen.run();
    console.log("BlogGen is done!");
})();
