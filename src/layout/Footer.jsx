import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Button from "../components/ui/Button";
import Reveal from "../components/ui/Reveal";
import { BRAND, CONTACT, NAV_LINKS } from "../utils/constants";
import { whatsappLink } from "../utils/whatsapp";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    // pb-24 on mobile keeps the sticky bar from covering the footer's end
    <footer className="mx-auto max-w-6xl px-5 pb-24 md:pb-10">
      {/* Final call to action */}
      <Reveal>
        <div className="glass-panel relative overflow-hidden rounded-3xl px-6 py-14 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,75,0.15),transparent_65%)]" />
          <div className="relative">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Ready to Make It Yours?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Order today and pay only when it reaches your door.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href="#buy-now"
                className="w-full whitespace-nowrap px-8 py-3.5 text-base sm:w-auto"
              >
                Order Cash on Delivery
              </Button>
              <Button
                href={whatsappLink(
                  CONTACT.whatsapp,
                  "Hi, I have a question about your product."
                )}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                className="w-full whitespace-nowrap px-8 py-3.5 text-base sm:w-auto"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Link columns */}
      <div className="mt-14 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-semibold">{BRAND.name}</p>
          <p className="mt-3 max-w-xs text-sm text-muted">{BRAND.tagline}</p>
        </div>

        <div>
          <p className="text-sm font-semibold">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#buy-now" className="transition-colors hover:text-white">
                Order Now
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Contact Us</p>
          <ul className="mt-3 space-y-3 text-sm text-muted">
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-gold" />
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-white">
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle size={16} className="shrink-0 text-gold" />
              <a
                href={whatsappLink(CONTACT.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-gold" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-white">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="shrink-0 text-gold" />
              {CONTACT.address}
            </li>
          </ul>
          <p className="mt-3 text-xs text-muted">{CONTACT.hours}</p>
        </div>
      </div>

      <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-muted">
        © {year} {BRAND.name}. All rights reserved.
      </div>
    </footer>
  );
}