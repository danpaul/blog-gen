import { ContentItemsInterface } from "../Data/ContentItemsInterface";

export type BuildFilterType = (args: {
  contentItems: ContentItemsInterface[];
}) => Promise<void>;
