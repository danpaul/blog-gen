const BlogGenRenderPaginateResult = (paginatedResult) => {
    let content = "";
    const image = (image) => {
        if (!image)
            return "";
        return `<img src="${image.src}" alt="${image.alt}">`;
    };
    const previousPage = () => {
        if (!paginatedResult.previousPageUrl) {
            return "";
        }
        return `<a href="${paginatedResult.previousPageUrl}">Previous</a>`;
    };
    const nextPage = () => {
        if (!paginatedResult.nextPageUrl) {
            return "";
        }
        return `<a href="${paginatedResult.nextPageUrl}">Next</a>`;
    };
    paginatedResult.posts.forEach((post) => {
        content += `
          <article>
              <h2>${post.title}</h2>
              ${image(post.featuredImage)}
              <p>${post.excerpt}</p>
              <a href="${post.relativeUrlPath}">Read More</a>
          <article>
      `;
    });
    content = `
      ${content}
      <div style="display: flex; justify-content: space-between;">
          ${previousPage()}
          ${nextPage()}
      </div>
    `;
    return content;
};
export default BlogGenRenderPaginateResult;
