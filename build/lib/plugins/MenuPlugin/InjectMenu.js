"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectMenu = void 0;
class InjectMenu {
    constructor({ menuItems, contentItems, options, }) {
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
              ${children && children.length > 0
                ? this.renderNodes(children)
                : ""}
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
        </script>
    `;
    }
}
exports.InjectMenu = InjectMenu;