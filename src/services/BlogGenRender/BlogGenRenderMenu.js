const menuScript = `
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
const BlogGenRenderMenu = ({ pageNodes, siteMeta, }) => {
    return async () => {
        const renderNodes = (nodes) => {
            let html = "";
            pageNodes
                .filter(({ isDisplayedInMenu }) => isDisplayedInMenu)
                .forEach((n) => {
                html = `
            ${html}
            <li>
                <a href="${n.url}">
                    ${n.title}
                </a>
                ${n.children.length > 0 ? renderNodes(n.children) : ""}
            </li>`;
            });
            return `<ul>${html}</ul>`;
        };
        return `
      ${menuScript}
      <h3 style="display: flex; justify-content: space-between;">
        <a href="index.html">
          ${siteMeta.title}
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
        ${renderNodes(pageNodes)}
      </div>
      `;
    };
};
export default BlogGenRenderMenu;
