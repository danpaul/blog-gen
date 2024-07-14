import BlogGen from "../../BlogGenBase";

export interface PluginInterface {
  init: (blogGen: BlogGen) => Promise<void>;
}
