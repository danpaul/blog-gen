"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogGenBase = exports.BlogGen = void 0;
const BlogGen_1 = __importDefault(require("./lib/BlogGen/BlogGen"));
exports.BlogGen = BlogGen_1.default;
const BlogGenBase_1 = __importDefault(require("./lib/BlogGen/BlogGenBase"));
exports.BlogGenBase = BlogGenBase_1.default;
