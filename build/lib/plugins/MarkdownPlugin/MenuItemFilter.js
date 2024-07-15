export const MenuItemFilter = ({ menuItems, contentItems, }) => {
    const pages = contentItems.filter(({ type }) => type == "page");
    return [
        ...menuItems,
        ...pages.map((p) => ({
            title: p.title,
            href: p.pageUrl,
        })),
    ];
};
