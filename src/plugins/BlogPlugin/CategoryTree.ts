/**
 * - label
 * - items
 * - children
 */

import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";

export type CategoryTreeNode = {
  items: ContentItemsInterface[];
  children: { [key: string]: CategoryTreeNode };
};

export class CategoryTree {
  private contentItems: ContentItemsInterface[];
  public readonly tree: CategoryTreeNode;

  constructor({ contentItems }: { contentItems: ContentItemsInterface[] }) {
    this.contentItems = contentItems;
    this.tree = this.getCategoryTree();
  }

  public async iterateTree(
    callback: (
      categories: string[],
      items: ContentItemsInterface[]
    ) => Promise<void>,
    options?: {
      currentCategory: string[];
      currentNode: CategoryTreeNode;
    }
  ) {
    const currentNode: CategoryTreeNode = options?.currentNode || this.tree;
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

  private getCategoryTree(): CategoryTreeNode {
    const tree = this.getEmptyTreeNode();
    this.contentItems.forEach((contentItem) => {
      if (contentItem?.meta?.category?.length) {
        let treeReference = tree.children;
        // @ts-ignore
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

  private getEmptyTreeNode(): CategoryTreeNode {
    return {
      items: [],
      children: {},
    };
  }
}
