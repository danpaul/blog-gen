"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentItemFilter = void 0;
const ContentItemFilter = ({ options, contentItem, }) => {
    let title = options.title || "";
    title = `${title}${title && contentItem.title ? " - " : ""}`;
    title = contentItem.title ? `${title}${contentItem.title}` : title;
    contentItem.$("head").append(`<title>${title}</title>`);
    return contentItem;
};
exports.ContentItemFilter = ContentItemFilter;
