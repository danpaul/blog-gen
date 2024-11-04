import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import { BlogGenSiteOptionsType } from "../../BlogGen/TypesInterfaces/OptionsTypes";

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
  contentItem.$("head").append(`<meta charset="UTF-8">`);
  contentItem
    .$("head")
    .append(
      `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
    );
  return contentItem;
};
