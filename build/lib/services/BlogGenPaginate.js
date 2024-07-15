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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const constants_1 = __importDefault(require("../constants"));
const buildUrl = (pageNumber) => {
    return pageNumber == 1 ? "index.html" : `${pageNumber}.html`;
};
const BlogGenPaginate = async ({ sortedParsedFiles, options, }) => {
    const { paginateResultsPerPage } = constants_1.default;
    const numberOfPages = Math.ceil(sortedParsedFiles.posts.length / paginateResultsPerPage);
    const paginatedItems = [];
    for (let i = 1; i <= numberOfPages; i++) {
        paginatedItems.push({
            currentPage: i,
            currentPageUrl: buildUrl(i),
            previousPageUrl: i > 1 ? buildUrl(i - 1) : null,
            nextPageUrl: i < numberOfPages ? buildUrl(i + 1) : null,
            posts: sortedParsedFiles.posts.slice((i - 1) * paginateResultsPerPage, paginateResultsPerPage * i),
            buildPath: path.normalize(`${options.distRoot}/${buildUrl(i)}`),
        });
    }
    return paginatedItems;
};
exports.default = BlogGenPaginate;
