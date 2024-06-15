import BlogGen from "../../BlogGen";

export interface PluginInterface {
  init: (blogGen: BlogGen) => Promise<void>;
}
