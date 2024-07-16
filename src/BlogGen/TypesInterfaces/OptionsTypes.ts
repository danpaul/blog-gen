/**
 * Top Level options
 */

// all required
export type BlogGenOptionsType = {
  site: BlogGenSiteOptionsType;
  build: BlogGenBuildOptionsType;
};

// all optional
export type BlogGenOptionsOptionalType = {
  site?: AllOptional<BlogGenSiteOptionsType>;
  build?: AllOptional<BlogGenBuildOptionsType>;
};

/**
 * Site Options
 */

export type BlogGenSiteOptionsType = {
  title: string;
  description: string;
  author: string;
  keywords: string[];
};

/**
 * Build Options
 */

export type BlogGenBuildOptionsType = {
  contentRoot: string;
  distRoot: string;
  itemsPerPage: number;
};

/**
 * Partial to make all properties optional
 */

type AllOptional<T> = {
  [P in keyof T]?: T[P];
};
