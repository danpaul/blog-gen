import { ContentItemsInterface } from "../Data/ContentItemsInterface";

export type SourceFilterType = (
  contentItems: ContentItemsInterface[]
) => Promise<ContentItemsInterface[]>;
