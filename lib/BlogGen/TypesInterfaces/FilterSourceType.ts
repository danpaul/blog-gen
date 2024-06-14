import { ContentItemsInterface } from "./Data/ContentItemsInterface";

export type FilterSourceType = (
  contentItems: ContentItemsInterface[]
) => Promise<ContentItemsInterface[]>;
