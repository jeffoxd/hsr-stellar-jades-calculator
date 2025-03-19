import { marked } from "marked";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 *
 * @param value - title (pure string), content (markdown string)
 * @returns React component of an Accordion list
 */
export default function AccordionMarkdownList({
  value,
}: {
  value: Array<{ title: string; content: string }>;
}) {
  // https://github.com/markedjs/marked/issues/655#issuecomment-712380889
  const renderer = new marked.Renderer();
  const linkRenderer = renderer.link;
  renderer.link = (link) => {
    const { href } = link;
    const localLink = href.startsWith(
      `${location.protocol}//${location.hostname}`
    );
    const html = linkRenderer.call(renderer, link);
    return localLink
      ? html
      : html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener" `);
  };

  return (
    <Accordion type="multiple">
      {value.map((item, i) => (
        <AccordionItem value={`item-${i + 1}`} key={i}>
          <AccordionTrigger className="font-semibold">
            {item.title}
          </AccordionTrigger>
          <AccordionContent>
            <div
              className="prose-ul:list-disc prose-ul:list-inside"
              dangerouslySetInnerHTML={{
                __html: marked.parse(item.content, { renderer }),
              }}
            ></div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
