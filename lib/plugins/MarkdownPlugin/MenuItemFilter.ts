import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import { MenuItemInterface } from "../../BlogGen/TypesInterfaces/Data/MenuItemInterface";

export const MenuItemFilter = ({
  menuItems,
  contentItems,
}: {
  menuItems: MenuItemInterface[];
  contentItems: ContentItemsInterface[];
}): MenuItemInterface[] => {
  const pages = contentItems.filter(({ type }) => type == "page");
  return [
    ...menuItems,
    ...pages.map((p) => ({
      title: p.title,
      href: p.pageUrl,
    })),
  ];
};
