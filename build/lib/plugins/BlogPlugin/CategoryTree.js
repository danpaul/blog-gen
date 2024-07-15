/**
 * - label
 * - items
 * - children
 */
export class CategoryTree {
    constructor({ contentItems }) {
        this.contentItems = contentItems;
        this.tree = this.getCategoryTree();
    }
    async iterateTree(callback, options) {
        const currentNode = options?.currentNode || this.tree;
        for (const key of Object.keys(currentNode.children)) {
            const currentCategory = [...(options?.currentCategory || []), key];
            const childNode = currentNode.children[key];
            await callback(currentCategory, childNode.items);
            if (Object.keys(childNode.children).length) {
                this.iterateTree(callback, {
                    currentCategory,
                    currentNode: childNode,
                });
            }
        }
    }
    getCategoryTree() {
        const tree = this.getEmptyTreeNode();
        this.contentItems.forEach((contentItem) => {
            if (contentItem?.meta?.category?.length) {
                let treeReference = tree.children;
                contentItem.meta.category.forEach((category) => {
                    if (!treeReference[category]) {
                        treeReference[category] = this.getEmptyTreeNode();
                    }
                    treeReference[category].items.push(contentItem);
                    treeReference = treeReference[category].children;
                });
            }
        });
        return tree;
    }
    getEmptyTreeNode() {
        return {
            items: [],
            children: {},
        };
    }
}
