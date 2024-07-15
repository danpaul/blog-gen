'use strict';

var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs-extra');
var fs$1 = require('fs/promises');
var module$1 = require('module');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var cheerio__namespace = /*#__PURE__*/_interopNamespaceDefault(cheerio);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);
var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var fs__namespace$1 = /*#__PURE__*/_interopNamespaceDefault(fs$1);

class ArchivePageTemplate {
  previousPageUrl;
  nextPageUrl;
  items;
  categoryLinks;
  constructor({
    previousPageUrl,
    nextPageUrl,
    items,
    categoryLinks
  }) {
    this.previousPageUrl = previousPageUrl;
    this.nextPageUrl = nextPageUrl;
    this.items = items;
    this.categoryLinks = categoryLinks;
  }
  render() {
    const $ = cheerio__namespace.load("");
    const body = $("body");
    if (this.categoryLinks.length) {
      body.append(`<h1 style="padding-bottom: 60px;">Category: </h1>`);
      const h1 = $("body h1");
      this.categoryLinks.forEach(({ label, url }, index) => {
        h1.append(`<a href="${url}">${label}</a>`);
        if (index < this.categoryLinks.length - 1) {
          h1.append(" / ");
        }
      });
    }
    this.items.forEach(({ title, featuredImage, excerpt, pageUrl, $: $2 }) => {
      let header = `<h2><a href="${pageUrl}">${title}<a/></h2>`;
      const clonedHeader = cheerio__namespace.load($2("body header").toString());
      if (clonedHeader) {
        clonedHeader("h1").replaceWith(`<h2>${clonedHeader("h1").text()}</h2>`);
        header = clonedHeader("header").html() || "";
      }
      body.append(
        `
          <article>
            ${header}
            ${this.getImage(featuredImage)}
            <p>${excerpt || ""}</p>
            <a href="${pageUrl}">More...</a>
          <article>
        `
      );
    });
    body.append(`
      <div style="display: flex; justify-content: space-between;">
          ${this.previousPageLink()}
          ${this.nextPageLink()}
      </div>    
    `);
    return $;
  }
  getImage(image) {
    if (!image)
      return "";
    return `<img src="${image.src}" alt="${image.alt}">`;
  }
  previousPageLink() {
    if (!this.previousPageUrl) {
      return "";
    }
    return `<a href="${this.previousPageUrl}">Previous</a>`;
  }
  nextPageLink() {
    if (!this.nextPageUrl) {
      return "";
    }
    return `<a href="${this.nextPageUrl}">Next</a>`;
  }
}

class CategoryTree {
  contentItems;
  tree;
  constructor({ contentItems }) {
    this.contentItems = contentItems;
    this.tree = this.getCategoryTree();
  }
  async iterateTree(callback, options) {
    const currentNode = options?.currentNode || this.tree;
    for (const key of Object.keys(currentNode.children)) {
      const currentCategory = [...options?.currentCategory || [], key];
      const childNode = currentNode.children[key];
      await callback(currentCategory, childNode.items);
      if (Object.keys(childNode.children).length) {
        this.iterateTree(callback, {
          currentCategory,
          currentNode: childNode
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
      children: {}
    };
  }
}

class BlogPlugin {
  itemsPerPage;
  constructor({ itemsPerPage }) {
    this.itemsPerPage = itemsPerPage;
  }
  async init(blogGen) {
    blogGen.addContentItemsFilter(this.filterContentItems.bind(this));
    blogGen.addMenuItemsFilter(this.menuFilter.bind(this));
  }
  async menuFilter({
    menuItems,
    contentItems
  }) {
    const blogContentItems = this.getBlogContentItems(contentItems);
    const categoryMenuItems = [];
    const addNodes = (node, menuItems2, categories) => {
      for (const property in node.children) {
        const currentCategory = [...categories, property];
        const currentNode = node.children[property];
        const menuItem = {
          title: property,
          href: this.getCategoryLink(currentCategory).url
        };
        if (Object.keys(currentNode.children).length) {
          menuItem.children = [];
          addNodes(currentNode, menuItem.children, currentCategory);
        }
        menuItems2.push(menuItem);
      }
    };
    const categoryTree = new CategoryTree({ contentItems: blogContentItems });
    if (Object.keys(categoryTree.tree.children).length) {
      categoryMenuItems.push({ title: "Categories", children: [] });
      if (categoryMenuItems[0].children) {
        addNodes(categoryTree.tree, categoryMenuItems[0].children, []);
      }
    }
    return [
      ...menuItems,
      ...categoryMenuItems.length ? categoryMenuItems : []
    ];
  }
  async filterContentItems(contentItems) {
    const blogContentItems = this.getBlogContentItems(contentItems);
    return [
      ...this.addBlogMetaToPageContentItems(contentItems),
      // add main, uncategorized blog items
      ...this.getArchivePages(blogContentItems),
      // get category archive pages
      ...await this.getCategoryArchivePages(blogContentItems)
    ];
  }
  addBlogMetaToPageContentItems(contentItems) {
    return contentItems.map((contentItem) => {
      const categoryLinks = this.getCategoryLinks(contentItem.meta.category);
      const header = contentItem.$("body header");
      if (categoryLinks.length && header) {
        let el = "<h6>Category: ";
        categoryLinks.forEach(({ label, url }, index) => {
          el = `${el}<a href="${url}">${label}</a>`;
          if (index < categoryLinks.length - 1) {
            el = `${el} / `;
          }
        });
        el = `${el}</h6>`;
        header.append(el);
      }
      return contentItem;
    });
  }
  getArchivePages(contentItems) {
    return this.generateArchivePages({
      paginatedItems: this.paginate(contentItems)
    });
  }
  async getCategoryArchivePages(contentItems) {
    let categoryArchivePages = [];
    await new CategoryTree({ contentItems }).iterateTree(
      async (categories, items) => {
        const paginatedCategoryItems = this.paginate(items);
        categoryArchivePages = [
          ...categoryArchivePages,
          ...this.generateArchivePages({
            paginatedItems: paginatedCategoryItems,
            categories
          })
        ];
      }
    );
    return categoryArchivePages;
  }
  getBlogContentItems(contentItems) {
    return contentItems.filter(({ type }) => type == "post").sort(this.compareItemsByDate);
  }
  generateArchivePages({
    paginatedItems,
    categories
  }) {
    const contentItems = [];
    paginatedItems.forEach((items, index) => {
      const { pageUrl, nextPageUrl, previousPageUrl } = this.getPageUrls({
        paginatedItems,
        categories,
        index
      });
      const isHome = !categories && index == 0;
      const categoryId = this.getCategoryId(categories);
      const archivePageTemplate = new ArchivePageTemplate({
        previousPageUrl: previousPageUrl || void 0,
        nextPageUrl: nextPageUrl || void 0,
        items,
        categoryLinks: this.getCategoryLinks(categories)
      });
      contentItems.push({
        title: isHome ? "Home" : categoryId ? `${categoryId}-${index + 1}` : `archive-${index + 1}`,
        type: "blog-archive",
        meta: {},
        pageUrl,
        $: archivePageTemplate.render()
      });
    });
    return contentItems;
  }
  compareItemsByDate(a, b) {
    if (!a && !b) {
      return 0;
    } else if (a && !b) {
      return -1;
    } else if (!a && b) {
      return 1;
    }
    return (b?.published ? b.published.getMilliseconds() : 0) - (a?.published ? a.published.getMilliseconds() : 0);
  }
  paginate(items) {
    const paginatedItems = [];
    const numberOfPages = Math.ceil(items.length / this.itemsPerPage);
    for (let i = 1; i <= numberOfPages; i++) {
      paginatedItems.push(
        items.slice((i - 1) * this.itemsPerPage, this.itemsPerPage * i)
      );
    }
    return paginatedItems;
  }
  getCategoryId(categories) {
    return categories ? categories.join("-") : "";
  }
  getCategoryUrl(categories, page) {
    return `category-${categories.join("-")}-${page}.html`;
  }
  getCategoryLink(categories) {
    const link = {
      label: "",
      url: ""
    };
    if (!categories.length) {
      console.error("cannot build link from empty category");
      return link;
    }
    link.label = categories[categories.length - 1];
    link.url = this.getCategoryUrl(categories, 1);
    return link;
  }
  getCategoryLinks(categories) {
    const links = [];
    if (!categories)
      return links;
    for (let i = 0; i < categories.length; i++) {
      const categoriesSubgroup = categories.slice(0, i + 1);
      links.push(this.getCategoryLink(categoriesSubgroup));
    }
    return links;
  }
  getPageUrls({
    paginatedItems,
    categories,
    index
  }) {
    const hasNextPage = paginatedItems.length > index + 1;
    const hasPreviousPage = index != 0;
    const isHome = !categories && index == 0;
    const pageUrl = isHome ? "index.html" : categories ? this.getCategoryUrl(categories, index + 1) : `${index + 1}.html`;
    const nextPageUrl = hasNextPage ? categories ? this.getCategoryUrl(categories, index + 2) : `${index + 2}.html` : null;
    const previousPageUrl = hasPreviousPage ? categories ? this.getCategoryUrl(categories, index) : index == 1 ? "index.html" : `${index}.html` : null;
    return {
      pageUrl,
      nextPageUrl,
      previousPageUrl
    };
  }
}

class FileBuildPlugin {
  distRoot;
  contentRoot;
  assetPath;
  get assetDistPath() {
    return path__namespace.normalize(`${this.distRoot}/${this.assetPath}`);
  }
  get assetSrcPath() {
    return path__namespace.normalize(`${this.contentRoot}/${this.assetPath}`);
  }
  constructor({
    distRoot,
    contentRoot,
    assetPath = "assets"
  }) {
    this.distRoot = distRoot;
    this.contentRoot = contentRoot;
    this.assetPath = assetPath;
  }
  async init(blogGen) {
    blogGen.addPreBuildFilter(this.preBuildFilter.bind(this));
    blogGen.addBuildFilter(this.buildFilter.bind(this));
  }
  async preBuildFilter() {
    await this.cleanBuildDir();
  }
  async buildFilter({
    contentItems
  }) {
    await this.buildContent({ contentItems });
    await this.migrateAssets();
  }
  async cleanBuildDir() {
    await fs__namespace.rm(this.distRoot, { recursive: true, force: true });
    await fs__namespace.mkdir(this.distRoot);
  }
  async buildContent({
    contentItems
  }) {
    for (const contentItem of contentItems) {
      await fs__namespace.writeFile(
        path__namespace.normalize(`${this.distRoot}/${contentItem.pageUrl}`),
        contentItem.$.root().html() || ""
      );
    }
  }
  async migrateAssets() {
    await fs__namespace.ensureDir(this.assetDistPath);
    await fs__namespace.copy(this.assetSrcPath, this.assetDistPath);
  }
}

const FILE_NAME = "assets/css/github-markdown.css";
const SOURCE_FILE_PATH = "./node_modules/github-markdown-css/github-markdown.css";
const BASE_STYLES = `
  <style>
    .markdown-body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
      padding: 45px;
    }

    @media (max-width: 767px) {
      .markdown-body {
        padding: 15px;
      }
    }
  </style>
`;
class GithubMarkdownStylePlugin {
  // @ts-ignore
  blogGen;
  distRoot;
  constructor({ distRoot }) {
    this.distRoot = distRoot;
  }
  async init(blogGen) {
    this.blogGen = blogGen;
    this.blogGen.addPreBuildFilter(this.preBuildFilter.bind(this));
    this.blogGen.addBuildFilter(this.buildFilter.bind(this));
  }
  async preBuildFilter({
    contentItems
  }) {
    contentItems.forEach(({ $ }) => {
      $("head").append(`<link rel="stylesheet" href="${FILE_NAME}">`);
      const body = $("body");
      $("head").append(BASE_STYLES);
      $("body").replaceWith(`<main class="markdown-body">${body}</main>`);
    });
  }
  async buildFilter() {
    await fs__namespace.copy(
      path__namespace.normalize(SOURCE_FILE_PATH),
      path__namespace.normalize(`${this.distRoot}/${FILE_NAME}`)
    );
  }
}

var require$1 = (
			false
				? /* @__PURE__ */ module$1.createRequire((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('index.js', document.baseURI).href)))
				: require
		);

const yaml = require$1("js-yaml");
const showdown = require$1("showdown");
const converter = new showdown.Converter({ metadata: true });
class ContentItemFile {
  title = "";
  type = "";
  published = /* @__PURE__ */ new Date();
  // @ts-ignore
  $;
  meta = {};
  excerpt = "";
  pageUrl = "";
  featuredImage;
  constructor({ file, contentRoot }) {
    return (async () => {
      const { name } = file;
      const isPage = name.substring(0, 4).toLowerCase() == "page";
      const cutFileName = isPage ? name.substring(5) : name;
      const unCutFileNameWithoutExtension = cutFileName.substring(
        0,
        cutFileName.length - 3
      );
      const cutFileNameWithoutExtension = cutFileName.substring(
        11,
        cutFileName.length - 3
      );
      const dateString = cutFileName.substring(0, 10);
      const title = cutFileNameWithoutExtension.replaceAll("_", " ");
      const filePath = path__namespace.normalize(contentRoot + "/" + name);
      const fileString = await fs__namespace.readFile(filePath, "utf-8");
      const fileMarkup = converter.makeHtml(fileString);
      const $ = cheerio__namespace.load(fileMarkup);
      $("body").prepend(`
        <header>
          <h1>${title}</h1>
          <h6>Published: ${dateString}</h6>
        </header>
      `);
      const metadata = yaml.load(converter.getMetadata(true)) || {};
      const excerpt = $("p").first().text() || "";
      const firstImage = $("img").first();
      const featuredImage = firstImage && firstImage?.attr("src") && // @ts-ignore
      firstImage.attr("src").indexOf("assets") == 0 ? {
        src: firstImage.attr("src"),
        alt: firstImage.attr("alt") || ""
      } : null;
      const relativeUrlPath = (isPage ? cutFileNameWithoutExtension : unCutFileNameWithoutExtension).toLocaleLowerCase().replaceAll("_", "-") + ".html";
      this.title = title;
      this.type = isPage ? "page" : "post";
      this.published = new Date(dateString);
      this.$ = $;
      this.excerpt = excerpt;
      this.featuredImage = featuredImage || void 0;
      this.pageUrl = relativeUrlPath;
      this.meta = metadata;
      return this;
    })();
  }
  // @ts-ignore
  render;
}

class FileMapper {
  files;
  contentRoot;
  constructor({
    files,
    contentRoot
  }) {
    this.files = files;
    this.contentRoot = contentRoot;
  }
  async mapFiles() {
    return Promise.all(
      this.files.filter(this.filter.bind(this)).map(
        async (f) => await new ContentItemFile({
          file: f,
          contentRoot: this.contentRoot
        })
      )
    );
  }
  filter(f) {
    return this.isMarkdownFile(f) && this.isPublicFile(f);
  }
  isMarkdownFile(f) {
    return f.isFile() && path__namespace.extname(f.name).toLowerCase() == ".md";
  }
  isPublicFile(f) {
    return f.name[0] && f.name[0] !== "_";
  }
}

const ContentItemFilter = ({
  options,
  contentItem
}) => {
  let title = options.title || "";
  title = `${title}${title && contentItem.title ? " - " : ""}`;
  title = contentItem.title ? `${title}${contentItem.title}` : title;
  contentItem.$("head").append(`<title>${title}</title>`);
  return contentItem;
};

const MenuItemFilter = ({
  menuItems,
  contentItems
}) => {
  const pages = contentItems.filter(({ type }) => type == "page");
  return [
    ...menuItems,
    ...pages.map((p) => ({
      title: p.title,
      href: p.pageUrl
    }))
  ];
};

class MarkdownPlugin {
  contentRoot;
  // @ts-ignore
  blogGen;
  constructor({ contentRoot }) {
    this.contentRoot = contentRoot;
  }
  async init(blogGen) {
    this.blogGen = blogGen;
    this.blogGen.addSourceFilter(this.sourceFilter.bind(this));
    this.blogGen.addPreBuildFilter(this.preBuildFilter.bind(this));
    this.blogGen.addMenuItemsFilter(this.menuFilter.bind(this));
  }
  async sourceFilter(contentItems) {
    const files = await fs__namespace$1.readdir(this.contentRoot, { withFileTypes: true });
    const fileMapper = new FileMapper({ files, contentRoot: this.contentRoot });
    return [...contentItems, ...await fileMapper.mapFiles()];
  }
  async preBuildFilter({
    contentItems
  }) {
    contentItems.map(
      (contentItem) => ContentItemFilter({ contentItem, options: this.blogGen.siteOptions })
    );
  }
  async menuFilter({
    menuItems,
    contentItems
  }) {
    return MenuItemFilter({ menuItems, contentItems });
  }
}

class InjectMenu {
  menuItems;
  contentItems;
  options;
  constructor({
    menuItems,
    contentItems,
    options
  }) {
    this.menuItems = menuItems;
    this.contentItems = contentItems;
    this.options = options;
  }
  inject() {
    const menuString = this.getMenuString();
    this.contentItems.forEach((i) => {
      i.$("body").prepend(menuString);
    });
    return this.contentItems;
  }
  getMenuString() {
    return `
      ${this.getMenuScript()}
      <h3 style="display: flex; justify-content: space-between;">
        <a href="index.html">
          ${this.options.title}
        </a>
        <a href="#" onclick="blogGenRenderMenuScriptOpen()">MENU</a>
      </h3>
      <hr>
      <div
        style="position: absolute; display: none; top: 0; left: 0; right: 0; bottom: 0; background: white; padding: 15px;"
        id="blogGenRenderMenuWrapper"
      >
        <a
          href="#"
          onclick="blogGenRenderMenuScriptClose()"
          style="position: absolute; top: 10px; right: 10px; font-size: 24px; font-weight: bold;"
        >X</a>
        ${this.renderNodes(this.menuItems)}
      </div>
    `;
  }
  renderNodes(menuItems) {
    let html = "";
    menuItems.forEach(({ title, href, children }) => {
      html = `
          ${html}
          <li>
              <a href="${href}">
                  ${title}
              </a>
              ${children && children.length > 0 ? this.renderNodes(children) : ""}
          </li>`;
    });
    return `<ul>${html}</ul>`;
  }
  getMenuScript() {
    return `
        <script>
        function blogGenRenderMenuScriptOpen(e) {
            document.getElementById("blogGenRenderMenuWrapper").style.display = "block";
            return false;
        }
        function blogGenRenderMenuScriptClose(e) {
            document.getElementById("blogGenRenderMenuWrapper").style.display = "none";
            return false;
        }
        <\/script>
    `;
  }
}

class MenuPlugin {
  // @ts-ignore
  blogGen;
  async init(blogGen) {
    this.blogGen = blogGen;
    this.blogGen.addPreBuildFilter(this.preBuildFilter.bind(this));
  }
  async preBuildFilter({
    menuItems,
    contentItems
  }) {
    return new InjectMenu({
      menuItems,
      contentItems,
      options: this.blogGen.siteOptions
    }).inject();
  }
}

class BlogGenBase {
  // filters
  sourceFilters = [];
  contentItemsFilters = [];
  menuItemsFilters = [];
  preBuildFilters = [];
  buildFilters = [];
  // content items
  contentItems = [];
  // menuItems
  menuItems = [];
  // options
  siteOptions;
  constructor(siteOptions) {
    this.siteOptions = siteOptions;
  }
  async run() {
    for (const sourceFilter of this.sourceFilters) {
      this.contentItems = await sourceFilter(this.contentItems);
    }
    for (const contentItemFilter of this.contentItemsFilters) {
      this.contentItems = await contentItemFilter(this.contentItems);
    }
    for (const menuItemsfilter of this.menuItemsFilters) {
      this.menuItems = await menuItemsfilter({
        menuItems: this.menuItems,
        contentItems: this.contentItems
      });
    }
    for (const preBuildFilter of this.preBuildFilters) {
      await preBuildFilter({
        menuItems: this.menuItems,
        contentItems: this.contentItems
      });
    }
    for (const buildFilter of this.buildFilters) {
      await buildFilter({
        contentItems: this.contentItems
      });
    }
  }
  addPlugin(plugin) {
    plugin.init(this);
  }
  // used for `this.contentItems`
  addSourceFilter(sourceFilter) {
    this.sourceFilters.push(sourceFilter);
  }
  // runs after content items are added to add additional generated items
  addContentItemsFilter(contentItemsFilter) {
    this.contentItemsFilters.push(contentItemsFilter);
  }
  // used to generate menu items for `this.menuItems`
  addMenuItemsFilter(menuItemsFilter) {
    this.menuItemsFilters.push(menuItemsFilter);
  }
  // runs before build
  addPreBuildFilter(preBuildFilter) {
    this.preBuildFilters.push(preBuildFilter);
  }
  // runs to build
  addBuildFilter(buildFilter) {
    this.buildFilters.push(buildFilter);
  }
}

class BlogGen extends BlogGenBase {
  constructor(options) {
    super(options.site);
    const { contentRoot, distRoot, itemsPerPage } = options.build;
    this.addPlugin(new MarkdownPlugin({ contentRoot }));
    this.addPlugin(new MenuPlugin());
    this.addPlugin(
      new GithubMarkdownStylePlugin({
        distRoot
      })
    );
    this.addPlugin(
      new BlogPlugin({
        itemsPerPage
      })
    );
    this.addPlugin(new FileBuildPlugin({ distRoot, contentRoot }));
  }
}

const OPTIONS_FILE = "bloggen.json";
const defaultBuildOptions = () => ({
  contentRoot: "",
  distRoot: "",
  itemsPerPage: 10
});
const defaultSiteOptions = () => ({
  title: "",
  description: "",
  author: "",
  keywords: []
});
const GetBlogGenOptions = async ({
  contentRoot,
  distRoot
} = {}) => {
  const options = {
    site: defaultSiteOptions(),
    build: defaultBuildOptions()
  };
  options.build.contentRoot = contentRoot || process.cwd();
  options.build.distRoot = distRoot || path__namespace.normalize(`${options.build.contentRoot}/dist`);
  const jsonPath = path__namespace.normalize(
    `${options.build.contentRoot}/${OPTIONS_FILE}`
  );
  let jsonData = {};
  if (await fs__namespace.exists(jsonPath)) {
    try {
      const fileData = (await fs__namespace.readFile(jsonPath)).toString();
      jsonData = JSON.parse(fileData);
    } catch (error) {
      console.error(error);
    }
  }
  Object.keys(options).forEach((optionType) => {
    Object.keys(options[optionType]).forEach((option) => {
      const jsonValue = jsonData?.[optionType]?.[option];
      if (jsonValue) {
        options[optionType][option] = jsonValue;
      }
    });
  });
  return options;
};

exports.BlogGen = BlogGen;
exports.BlogGenBase = BlogGenBase;
exports.GetBlogGenOptions = GetBlogGenOptions;
