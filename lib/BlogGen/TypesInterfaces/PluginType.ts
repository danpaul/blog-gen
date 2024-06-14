import BlogGen from "../BlogGen";

export type PluginType = (blogGen: BlogGen) => Promise<void>;
