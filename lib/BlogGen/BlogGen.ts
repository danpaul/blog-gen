import { ContentItemsInterface } from "./TypesInterfaces/Data/ContentItemsInterface";
import { SourceFilterType } from "./TypesInterfaces/Filters/SourceFilterType";
import { PluginInterface } from "./TypesInterfaces/Plugins/PluginInterface";

class BlogGen {
  // filters
  private sourceFilters: SourceFilterType[] = [];

  // content items
  private contentItems: ContentItemsInterface[] = [];

  readonly distRoot: string;

  // take options
  constructor({ distRoot }: { distRoot: string }) {
    this.distRoot = distRoot;
  }

  public async run() {
    // run content filters
    for (const sourceFilter of this.sourceFilters) {
      this.contentItems = await sourceFilter(this.contentItems);
    }
  }

  public async addPlugin(plugin: PluginInterface) {
    await plugin.init(this);
  }

  public addSourceFilter(filterSource: SourceFilterType) {
    this.sourceFilters.push(filterSource);
  }
}

export default BlogGen;
