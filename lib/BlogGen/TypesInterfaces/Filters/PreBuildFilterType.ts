import { ContentItemsInterface } from "../Data/ContentItemsInterface";
import { MenuItemInterface } from "../Data/MenuItemInterface";

export type PreBuildFilterType = (params: {
  menuItems: MenuItemInterface[];
  contentItems: ContentItemsInterface[];
}) => Promise<void>;
