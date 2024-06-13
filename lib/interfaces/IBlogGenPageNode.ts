import IBlogGenRenderParameters from "./IBlogGenRenderParameters";

interface IBlogGenPageNode {
  title: string;
  url: string;
  buildPath: string;
  isDisplayedInMenu: boolean;
  renderBody: (p: IBlogGenRenderParameters) => Promise<string>;
  children: IBlogGenPageNode[];
}

export default IBlogGenPageNode;
