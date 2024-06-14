import { ContentItemsInterface } from "./TypesInterfaces/Data/ContentItemsInterface";
import { FilterSourceType } from "./TypesInterfaces/FilterSourceType";
import { PluginType } from "./TypesInterfaces/PluginType";

class BlogGen {
  // filters
  private filtersSources: FilterSourceType[] = [];

  // content items
  private contentItems: ContentItemsInterface[] = [];

  // take options
  constructor() {}

  public async run() {
    // run content filters
    for (const filterSource of this.filtersSources) {
      this.contentItems = await filterSource(this.contentItems);
    }
  }

  public addSourceFilter(filterSource: FilterSourceType) {
    this.filtersSources.push(filterSource);
  }
}

export default BlogGen;
