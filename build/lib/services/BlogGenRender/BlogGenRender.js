"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __importDefault(require("../../constants"));
const BlogGenRenderPaginateResult_1 = __importDefault(require("./BlogGenRenderPaginateResult"));
const BlogGenRender = async ({ parsedFile, paginatedResult, siteMeta, renderMenu, }) => {
    let htmlString = "";
    let { title } = siteMeta;
    if (parsedFile) {
        title = `${title} - ${parsedFile.title}`;
        htmlString = parsedFile.$("body").html();
    }
    else if (paginatedResult) {
        htmlString = (0, BlogGenRenderPaginateResult_1.default)(paginatedResult);
    }
    const menu = await renderMenu();
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${title}</title>
            <link rel="stylesheet" href="${constants_1.default.assetPathBlogGenCss.substring(1)}">
            <style>
                .markdown-body {
                    box-sizing: border-box;
                    min-width: 200px;
                    max-width: 980px;
                    margin: 0 auto;
                    padding: 45px;
                }

                @media (max-width: 767px) {
                    .markdown-body {
                        padding: 15px;
                    }
                }
            </style>
        </head>
        <body class="markdown-body">
          ${menu}
          <main>      
            ${htmlString}
          </main>
        </body>
    </html>`;
};
exports.default = BlogGenRender;
