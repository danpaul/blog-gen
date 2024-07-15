import IBloGenOptions from "./IBlogGenOptions";
import IBlogGenPageNode from "./IBlogGenPageNode";
import { IBlogGenSiteMeta } from "./IBlogGenSiteMeta";
import { IBlogGenSortedParsedFiles } from "./IBlogGenSortedParsedFiles";

interface IBlogGenPageNodeGen {
  nodes: IBlogGenPageNode[];
  parsedFiles: IBlogGenSortedParsedFiles;
  siteMeta: IBlogGenSiteMeta;
  options: IBloGenOptions;
}

export default IBlogGenPageNodeGen;
