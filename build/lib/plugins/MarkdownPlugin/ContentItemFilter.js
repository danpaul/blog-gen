export const ContentItemFilter = ({ options, contentItem, }) => {
    let title = options.title || "";
    title = `${title}${title && contentItem.title ? " - " : ""}`;
    title = contentItem.title ? `${title}${contentItem.title}` : title;
    contentItem.$("head").append(`<title>${title}</title>`);
    return contentItem;
};
