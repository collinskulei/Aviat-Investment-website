export const CONTENT_SECTIONS = {
  logo: {
    title: "Logo",
    description: "The brand logo in the header and footer",
    preview: "/",
  },
  hero: {
    title: "Home hero",
    description: "Background photo, headline, and tagline at the top of the Home page",
    preview: "/",
  },
  about: {
    title: "About page",
    description: "Who We Are, Our Mission, and the team photo",
    preview: "/about",
  },
  contact: {
    title: "Contact details",
    description: "Phone, email, address, and hours on the Contact page and footer",
    preview: "/contact",
  },
} as const;

export type ContentSection = keyof typeof CONTENT_SECTIONS;

export function isContentSection(value: string): value is ContentSection {
  return value in CONTENT_SECTIONS;
}
