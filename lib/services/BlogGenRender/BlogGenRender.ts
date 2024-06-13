import { IBlogGenParsedFile } from "../../interfaces/IBlogGenParsedFile";
import constants from "../../constants";
import IBlogGenPaginateResults from "../../interfaces/IBlogGenPaginateResults";
import { IBlogGenSiteMeta } from "../../interfaces/IBlogGenSiteMeta";
import IBlogGenRenderParameters from "../../interfaces/IBlogGenRenderParameters";
import BlogGenRenderPaginateResult from "./BlogGenRenderPaginateResult";

interface IBlogGenRender extends IBlogGenRenderParameters {
  parsedFile?: IBlogGenParsedFile;
  paginatedResult?: IBlogGenPaginateResults;
  siteMeta: IBlogGenSiteMeta;
}

const BlogGenRender = async ({
  parsedFile,
  paginatedResult,
  siteMeta,
  renderMenu,
}: IBlogGenRender) => {
  let htmlString: string = "";
  let { title } = siteMeta;
  if (parsedFile) {
    title = `${title} - ${parsedFile.title}`;
    htmlString = parsedFile.$("body").html();
  } else if (paginatedResult) {
    htmlString = BlogGenRenderPaginateResult(paginatedResult);
  }
  const menu: string = await renderMenu();
  return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${title}</title>
            <link rel="stylesheet" href="${constants.assetPathBlogGenCss.substring(
              1
            )}">
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

export default BlogGenRender;
