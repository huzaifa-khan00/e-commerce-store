import Accordion from "../ui/Accordion";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import { FAQS } from "../../data/faqs";

export default function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 pb-24">
      <SectionHeading
        label="FAQ"
        title="Questions? We've Got Answers"
      />
      <Reveal>
        <Accordion items={FAQS} />
      </Reveal>
    </section>
  );
}