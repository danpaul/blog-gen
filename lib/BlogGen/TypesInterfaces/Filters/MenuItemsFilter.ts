import { ContentItemsInterface } from "../Data/ContentItemsInterface";
import { MenuItemInterface } from "../Data/MenuItemInterface";

export type MenuItemsFilterType = (params: {
  menuItems: MenuItemInterface[];
  contentItems: ContentItemsInterface[];
}) => Promise<MenuItemInterface[]>;
