import { marked, Tokens } from "marked";

// modified https://github.com/markedjs/marked/issues/655#issuecomment-712380889
const renderer = {
  link({ href, title, text }: Tokens.Link): string {
    const localLink = href.startsWith(
      `${location.protocol}//${location.hostname}`
    );

    // to avoid title="null"
    if (title === null) {
      return localLink
        ? `<a href="${href}">${text}</a>`
        : `<a target="_blank" rel="noreferrer noopener" href="${href}">${text}</a>`;
    }
    return localLink
      ? `<a href="${href}" title="${title}">${text}</a>`
      : `<a target="_blank" rel="noreferrer noopener" href="${href}" title="${title}">${text}</a>`;
  },
};

marked.use({ renderer });

export default marked;
