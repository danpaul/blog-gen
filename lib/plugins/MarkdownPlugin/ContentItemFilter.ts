import { BlogGenOptionsType } from "../../BlogGen/BlogGenBase";
import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";

export const ContentItemFilter = ({
  options,
  contentItem,
}: {
  contentItem: ContentItemsInterface;
  options: BlogGenOptionsType;
}) => {
  let title = options.siteTitle || "";
  title = `${title}${title && contentItem.title ? " - " : ""}`;
  title = contentItem.title ? `${title}${contentItem.title}` : title;
  contentItem.$("head").append(`<title>${title}</title>`);
  return contentItem;
};
