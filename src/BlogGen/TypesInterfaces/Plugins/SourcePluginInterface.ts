import { ContentItemsInterface } from "../Data/ContentItemsInterface";

export default interface SourcePluginInterface {
  getItems: (
    contentItems: ContentItemsInterface[]
  ) => Promise<ContentItemsInterface[]>;
}
