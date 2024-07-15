import { BlogGenSiteOptionsType } from "../../BlogGen/Options";
import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";

export const ContentItemFilter = ({
  options,
  contentItem,
}: {
  contentItem: ContentItemsInterface;
  options: BlogGenSiteOptionsType;
}) => {
  let title = options.title || "";
  title = `${title}${title && contentItem.title ? " - " : ""}`;
  title = contentItem.title ? `${title}${contentItem.title}` : title;
  contentItem.$("head").append(`<title>${title}</title>`);
  return contentItem;
};
