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
  return (
    <Accordion type="multiple">
      {value.map((item, i) => (
        <AccordionItem value={`item-${i + 1}`} key={i}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>
            <p
              className="prose-ul:list-disc prose-ul:list-inside"
              dangerouslySetInnerHTML={{
                __html: marked.parse(item.content),
              }}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
