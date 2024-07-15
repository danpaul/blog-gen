import { ContentItemsInterface } from "../../BlogGen/TypesInterfaces/Data/ContentItemsInterface";
import { MenuItemInterface } from "../../BlogGen/TypesInterfaces/Data/MenuItemInterface";
import { BlogGenSiteOptionsType } from "../../BlogGen/Options";

export class InjectMenu {
  private menuItems: MenuItemInterface[];
  private contentItems: ContentItemsInterface[];
  private options: BlogGenSiteOptionsType;

  constructor({
    menuItems,
    contentItems,
    options,
  }: {
    menuItems: MenuItemInterface[];
    contentItems: ContentItemsInterface[];
    options: BlogGenSiteOptionsType;
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

  private getMenuString(): string {
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

  private renderNodes(menuItems: MenuItemInterface[]) {
    let html = "";
    menuItems.forEach(({ title, href, children }) => {
      html = `
          ${html}
          <li>
              <a href="${href}">
                  ${title}
              </a>
              ${
                children && children.length > 0
                  ? this.renderNodes(children)
                  : ""
              }
          </li>`;
    });
    return `<ul>${html}</ul>`;
  }
  private getMenuScript() {
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
        </script>
    `;
  }
}
