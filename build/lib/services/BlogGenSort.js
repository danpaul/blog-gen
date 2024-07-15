"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BlogGenSort = ({ files, }) => {
    const sorted = {
        pages: [],
        posts: [],
    };
    files.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
    files.forEach((f) => {
        if (f.type == "page") {
            sorted.pages.push(f);
        }
        else {
            sorted.posts.push(f);
        }
    });
    return sorted;
};
exports.default = BlogGenSort;
