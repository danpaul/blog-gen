import { ContentItemsInterface } from "./TypesInterfaces/Data/ContentItemsInterface";
import { SourceFilterType } from "./TypesInterfaces/Filters/SourceFilterType";
import { PluginInterface } from "./TypesInterfaces/Plugins/PluginInterface";
import { ContentItemsFilterType } from "./TypesInterfaces/Filters/ContentItemsFilterType";
import { MenuItemInterface } from "./TypesInterfaces/Data/MenuItemInterface";
import { MenuItemsFilterType } from "./TypesInterfaces/Filters/MenuItemsFilter";
import { PreBuildFilterType } from "./TypesInterfaces/Filters/PreBuildFilterType";
import { BuildFilterType } from "./TypesInterfaces/Filters/BuildFilterType";
import { BlogGenSiteOptionsType } from "./TypesInterfaces/OptionsTypes";

class BlogGenBase {
  // filters
  private sourceFilters: SourceFilterType[] = [];
  private contentItemsFilters: ContentItemsFilterType[] = [];
  private menuItemsFilters: MenuItemsFilterType[] = [];
  private preBuildFilters: PreBuildFilterType[] = [];
  private buildFilters: BuildFilterType[] = [];

  // content items
  private contentItems: ContentItemsInterface[] = [];

  // menuItems
  private menuItems: MenuItemInterface[] = [];

  // options
  readonly siteOptions: BlogGenSiteOptionsType;

  constructor(siteOptions: BlogGenSiteOptionsType) {
    this.siteOptions = siteOptions;
  }

  public async run() {
    // source filters
    for (const sourceFilter of this.sourceFilters) {
      this.contentItems = await sourceFilter(this.contentItems);
    }

    // content items filter
    for (const contentItemFilter of this.contentItemsFilters) {
      this.contentItems = await contentItemFilter(this.contentItems);
    }

    // menu filters
    for (const menuItemsfilter of this.menuItemsFilters) {
      this.menuItems = await menuItemsfilter({
        menuItems: this.menuItems,
        contentItems: this.contentItems,
      });
    }

    // pre build filters
    for (const preBuildFilter of this.preBuildFilters) {
      await preBuildFilter({
        menuItems: this.menuItems,
        contentItems: this.contentItems,
      });
    }

    // build filters
    for (const buildFilter of this.buildFilters) {
      await buildFilter({
        contentItems: this.contentItems,
      });
    }
  }

  public addPlugin(plugin: PluginInterface) {
    plugin.init(this);
  }

  // used for `this.contentItems`
  public addSourceFilter(sourceFilter: SourceFilterType) {
    this.sourceFilters.push(sourceFilter);
  }

  // runs after content items are added to add additional generated items
  public addContentItemsFilter(contentItemsFilter: ContentItemsFilterType) {
    this.contentItemsFilters.push(contentItemsFilter);
  }

  // used to generate menu items for `this.menuItems`
  public addMenuItemsFilter(menuItemsFilter: MenuItemsFilterType) {
    this.menuItemsFilters.push(menuItemsFilter);
  }

  // runs before build
  public addPreBuildFilter(preBuildFilter: PreBuildFilterType) {
    this.preBuildFilters.push(preBuildFilter);
  }

  // runs to build
  public addBuildFilter(buildFilter: BuildFilterType) {
    this.buildFilters.push(buildFilter);
  }
}

export default BlogGenBase;
