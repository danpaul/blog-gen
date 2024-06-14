import * as fs from "fs/promises";

import { FilterSourceType } from "../../BlogGen/TypesInterfaces/FilterSourceType";
import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";

interface FilterSourceStaticFilesParameters {
  contentRoot: string;
}

const FilterSourceStaticFiles: ({
  contentRoot,
}: FilterSourceStaticFilesParameters) => FilterSourceType = () => {
  return async (contentItems: ContentItemsInterface[]) => {
    const files = await fs.readdir(contentRoot, { withFileTypes: true });
    return contentItems;
  };
};

export default FilterSourceStaticFiles;
