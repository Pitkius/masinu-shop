export type BrandPhotoContact = {
  brand: string;
  email: string | null;
  contactUrl: string | null;
};

/** Public trade/info addresses only. APEX house SKUs go to the dropship feed, not a fake brand inbox. */
export const brandPhotoContacts: BrandPhotoContact[] = [
  { brand: "ATE", email: "ate.hotline@continental-corporation.com", contactUrl: "https://www.ate-brakes.com" },
  { brand: "Milltek", email: "info@millteksport.com", contactUrl: "https://www.millteksport.com/Contact.html" },
  { brand: "KW", email: "export@kwautomotive.de", contactUrl: "https://kwautomotive.de/en/contact/" },
  { brand: "Eventuri", email: "sales@eventuri.net", contactUrl: "https://www.eventuri.net/contact/" },
  { brand: "RacingLine", email: "info@racingline.com", contactUrl: "https://www.racingline.com/contact-us" },
  { brand: "Wagner", email: "info@wagner-tuning.de", contactUrl: "https://www.wagner-tuningshop.de/Anbieterinfo/Kontakt/" },
  { brand: "Elring", email: "info@elringklinger.com", contactUrl: "https://www.elring.com/contact" },
  { brand: "Goodridge", email: "info@goodridge.com", contactUrl: "https://goodridge.com" },
  { brand: "Pure Turbos", email: "info@pureturbos.com", contactUrl: "https://www.pureturbos.com/contact-us/" },
  { brand: "Nostrum", email: "support@nostrumshop.com", contactUrl: "https://nostrumshop.com/contact-us/" },
  { brand: "aFe", email: "info@afepower.com", contactUrl: "https://afepower.com" },
  { brand: "CSF", email: "info@csfrace.com", contactUrl: "https://www.csfrace.com" },
  { brand: "Unitronic", email: null, contactUrl: "https://www.unitronic.ca/contact" },
  { brand: "Gledring", email: null, contactUrl: "https://www.gledring.com/" },
  { brand: "Autoremeliai", email: "info@webauto.lt", contactUrl: "https://webauto.lt" },
  { brand: "Maxton Design", email: null, contactUrl: "https://www.maxtondesign.com" },
  { brand: "AlphaRex", email: null, contactUrl: "https://www.alpharexusa.com" },
  { brand: "Chemical Guys", email: null, contactUrl: "https://chemicalguys.com" },
  { brand: "VRSF", email: null, contactUrl: "https://www.vr-speed.com/contact-us" },
  { brand: "MHD", email: null, contactUrl: "https://mhdtuning.com/pages/contact" },
];
