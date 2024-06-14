export type BlogGenPluginType = (blogGen: BlogGen) => Promise<void>;

class BlogGen {
  // take options
  constructor() {}

  public async addPlugin(plugin: BlogGenPluginType) {
    await plugin(this);
  }

  public async addSourceFilter() {}
}

export default BlogGen;
