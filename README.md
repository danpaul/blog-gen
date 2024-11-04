# Blog-gen

## About

`Blog-gen` is a Node based static blog generator. `Blog-gen` is in development but is working to generate blogs.

`Blog-gen` was created for people who are focused on content and want to publish a relatively standard looking and functioning blog with as little coding and configuration as possible. `Blog-gen` just requires NPM. `Blog-gen` uses [github-markdown-css](https://github.com/sindresorhus/github-markdown-css) for styling.

## Usage

You write your content in a directory following a flat directory structure, follow a few conventions, install `Blog-gen` and generate your blog.

### Conventions

You should follow this directory structure:

```
/ - all your markdown files should be in the root
/assets - all your images and assets should be contained in the assets folder
```

File naming convention:

Files _must_ follow this naming convention:

```
YYYY-MM-DD_Post_name.md
```

I.e. `2024-01-01_My_first_post.md`

Underscores are treated as whitespace. The `YYYY-MM-DD` date at the start of the file is treated as the published date.

You may set you files to an unpublished state by starting them with an underscore. I.e. `_2024-01-01_My_unpublished_post.md`

Make all image paths relative. I.e. `assets/my-image.jpg`, _not_ `/assets/my-image.jpg`.

### Taxonomies

At the top of your Markdown file, you may add some Front Matter to define categories and tags for your post. That looks like this:

```
---
category: [foo, bar]
tags: [tag1, tag2]
---
```

Categories are hierarchical, tags are not. For this post, if the user selects, the `/foo` or the `/foo/bar` categories or any of the tags, the post will appear.
