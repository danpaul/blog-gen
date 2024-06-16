import { ContentItemsInterface } from "../Data/ContentItemsInterface";

export type ContentItemsFilterType = (
  contentItems: ContentItemsInterface[]
) => Promise<ContentItemsInterface[]>;
