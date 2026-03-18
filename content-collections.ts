import { defineSingleton, defineConfig } from "@content-collections/core";
import { z } from "zod";

// ---- Global ----
const global = defineSingleton({
  name: "global",
  filePath: "content/global.json",
  parser: "json",
  schema: z.object({
    supportEmail: z.string().email(),
  }),
});

// ---- Meta ----
const meta = defineSingleton({
  name: "meta",
  filePath: "content/meta.json",
  parser: "json",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    metadataBase: z.string().url(),
    openGraph: z.object({
      title: z.string(),
      description: z.string(),
      url: z.string().url(),
      siteName: z.string(),
      images: z.array(z.object({
        url: z.string(),
        width: z.number(),
        height: z.number(),
        alt: z.string(),
      })),
      locale: z.string(),
      type: z.string(),
    }),
    twitter: z.object({
      card: z.string(),
      title: z.string(),
      description: z.string(),
      images: z.array(z.string()),
    }),
    robots: z.object({
      index: z.boolean(),
      follow: z.boolean(),
    }),
  }),
});

// ---- Loader ----
const loader = defineSingleton({
  name: "loader",
  filePath: "content/loader.json",
  parser: "json",
  schema: z.object({
    words: z.array(z.string()),
  }),
});

// ---- Navigation ----
const submenuItem = z.object({
  id: z.string(),
  label: z.string(),
  scrollOffset: z.number(),
});

const navItem = z.object({
  id: z.string(),
  label: z.string(),
  hasSubmenu: z.boolean().optional(),
  submenu: z.array(submenuItem).optional(),
});

const navigation = defineSingleton({
  name: "navigation",
  filePath: "content/navigation.json",
  parser: "json",
  schema: z.object({
    navItems: z.array(navItem),
    drawerItems: z.array(navItem),
    cta: z.string(),
    hamburgerAriaLabel: z.string(),
    closeAriaLabel: z.string(),
    menuAriaLabel: z.string(),
  }),
});

// ---- Footer ----
const footer = defineSingleton({
  name: "footer",
  filePath: "content/footer.json",
  parser: "json",
  schema: z.object({
    brand: z.object({
      logoAlt: z.string(),
      tagline: z.string(),
      serviceArea: z.string(),
      offerings: z.string(),
      motto: z.string(),
    }),
    quickLinks: z.object({
      heading: z.string(),
      links: z.array(z.object({
        name: z.string(),
        href: z.string(),
      })),
    }),
    newsletter: z.object({
      heading: z.string(),
      placeholder: z.string(),
      submitLabel: z.string(),
      successMessage: z.string(),
    }),
    bottomBar: z.object({
      copyright: z.string(),
      links: z.array(z.object({
        label: z.string(),
        href: z.string(),
      })),
    }),
  }),
});

// ---- Contact ----
const contact = defineSingleton({
  name: "contact",
  filePath: "content/contact.json",
  parser: "json",
  schema: z.object({
    sectionLabel: z.string(),
    heading: z.string(),
    description: z.string(),
    location: z.string(),
    form: z.object({
      fields: z.object({
        firstName: z.object({ label: z.string() }),
        lastName: z.object({ label: z.string() }),
        email: z.object({ label: z.string() }),
        org: z.object({ label: z.string(), optionalNote: z.string() }),
        message: z.object({ label: z.string(), placeholder: z.string() }),
      }),
      submitLabel: z.string(),
      submittingLabel: z.string(),
      validation: z.object({
        firstNameRequired: z.string(),
        lastNameRequired: z.string(),
        emailRequired: z.string(),
        messageMinLength: z.string(),
        submitError: z.string(),
        networkError: z.string(),
      }),
    }),
    success: z.object({
      heading: z.string(),
      body: z.string(),
      resetLabel: z.string(),
    }),
  }),
});

// ---- Hero ----
const hero = defineSingleton({
  name: "hero",
  filePath: "content/hero.json",
  parser: "json",
  schema: z.object({
    tagline: z.object({
      line1: z.string(),
      emphasisPrefix: z.string(),
      emphasisWord: z.string(),
      line2: z.string(),
    }),
    description: z.string(),
    location: z.string(),
    buttonPrimary: z.string(),
    buttonSecondary: z.string(),
    scrollLabel: z.string(),
  }),
});

// ---- Need We Noticed ----
const needWeNoticed = defineSingleton({
  name: "needWeNoticed",
  filePath: "content/need-we-noticed.json",
  parser: "json",
  schema: z.object({
    label: z.string(),
    headline: z.string(),
    leftColumn: z.array(z.string()),
    rightColumn: z.array(z.string()),
  }),
});

// ---- Values ----
const values = defineSingleton({
  name: "values",
  filePath: "content/values.json",
  parser: "json",
  schema: z.object({
    label: z.string(),
    heading: z.string(),
    cards: z.array(z.object({
      title: z.string(),
      icon: z.string(),
      color: z.string(),
      description: z.string(),
    })),
  }),
});

// ---- Deeper Context ----
const deeperContext = defineSingleton({
  name: "deeperContext",
  filePath: "content/deeper-context.json",
  parser: "json",
  schema: z.object({
    heading: z.string(),
    subheading: z.string(),
    beats: z.array(z.object({
      label: z.string(),
      paragraphs: z.array(z.string()),
    })),
  }),
});

// ---- Storytelling ----
const storytelling = defineSingleton({
  name: "storytelling",
  filePath: "content/storytelling.json",
  parser: "json",
  schema: z.object({
    intro: z.object({
      headingPrefix: z.string(),
      headingAnimatedWord: z.string(),
      headingSuffix: z.string(),
      subtitle: z.string(),
      scrollLabel: z.string(),
    }),
    panels: z.array(z.object({
      id: z.string(),
      icon: z.string(),
      label: z.string(),
      title: z.string(),
      description: z.string(),
      secondaryDescription: z.string(),
      details: z.string(),
      items: z.array(z.string()),
      quote: z.string(),
    })),
    ecosystem: z.object({
      heading: z.string(),
      description: z.string(),
      nodes: z.array(z.object({
        label: z.string(),
        sublabel: z.string(),
        icon: z.string(),
        color: z.string(),
      })),
    }),
    progressLabels: z.array(z.string()),
  }),
});

// ---- Testimonials ----
const testimonials = defineSingleton({
  name: "testimonials",
  filePath: "content/testimonials.json",
  parser: "json",
  schema: z.object({
    label: z.string(),
    title: z.string(),
    expandLabel: z.string(),
    collapseLabel: z.string(),
    testimonials: z.array(z.object({
      pullQuote: z.string(),
      fullTestimonial: z.array(z.string()),
      author: z.string(),
      role: z.string(),
      org: z.string(),
    })),
  }),
});

// ---- Export all content ----
export default defineConfig({
  content: [
    global,
    meta,
    loader,
    navigation,
    footer,
    contact,
    hero,
    needWeNoticed,
    values,
    deeperContext,
    storytelling,
    testimonials,
  ],
});
