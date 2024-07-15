"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItemFilter = void 0;
const MenuItemFilter = ({ menuItems, contentItems, }) => {
    const pages = contentItems.filter(({ type }) => type == "page");
    return [
        ...menuItems,
        ...pages.map((p) => ({
            title: p.title,
            href: p.pageUrl,
        })),
    ];
};
exports.MenuItemFilter = MenuItemFilter;
