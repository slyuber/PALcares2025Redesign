// app/lib/storytelling-data.ts
// Centralized content data for Storytelling component
// Eliminates duplication between mobile and desktop layouts

import { Users, BookOpen, Sprout, FlaskConical } from "lucide-react";

export const STEP_LABELS = ["Intro", "Teams", "Research", "Labs", "Summary"] as const;

export const TOTAL_STEPS = 5;
export const HYSTERESIS_BUFFER = 0.08; // 8% buffer zone on each side of step boundary
export const STEP_OFFSET = 0.12; // Prevents edge snapping when clicking progress rail

// Animation timing constants
export const ACTIVE_DOT_HEIGHT = 36;
export const INACTIVE_DOT_HEIGHT = 6;
export const PANEL_TRANSITION_DURATION = 1000; // ms
export const GLOW_PULSE_DURATION = 2; // seconds

export interface PanelContent {
  id: string;
  icon: typeof Users;
  iconColor: string;
  label: string;
  title: string;
  description: string;
  highlightWords?: string[]; // Words to bold on desktop
  secondaryDescription?: string;
  details?: string;
  items: string[];
  quote?: string;
}

export const PANELS: PanelContent[] = [
  {
    id: "teams",
    icon: Users,
    iconColor: "text-orange",
    label: "Embedded Partnerships",
    title: "PAL Teams",
    description: "PAL Teams embeds technical staff directly within organizations for multi-year partnerships—building the relationships, processes, and infrastructure that let frontline expertise guide technology development.",
    highlightWords: ["multi-year partnerships"],
    secondaryDescription: "This is capacity building through daily work. Each tool we build addresses immediate needs while strengthening the connection between staff and their technical systems. We create the infrastructure—feedback loops, testing processes, communication channels—that makes this kind of iteration possible.",
    details: "The technical work ranges from urgent to strategic: the Excel formula that's mission-critical, the automated reporting saving weekends, the cloud infrastructure supporting growth, the cleaned data allowing you to tell your story more effectively. Multi-year commitment means we understand why that seemingly simple change is complex, why that workaround actually works.",
    items: [
      "Multi-year partnerships give time to build relationships, processes and understanding",
      "Contracts structured to give room for real flexibility",
      "Creating feedback loops that connect staff to their technology"
    ],
    quote: "Once shared understanding and working processes are in place, iteration becomes affordable and quick. A report adjustment isn't a new project—it's a conversation. The database evolves with your programs rather than constraining them."
  },
  {
    id: "research",
    icon: BookOpen,
    iconColor: "text-orange",
    label: "Turning Individual investments into sector resources.",
    title: "PAL Research",
    description: "PAL Research generalizes solutions built through Teams partnerships and releases them under open license—so what works for one organization can benefit others in the sector.",
    highlightWords: ["open license"],
    secondaryDescription: "This is knowledge transfer through proven solutions. Every tool we generalize has survived daily use, been shaped by frontline feedback, solved real operational problems. We work through the existing relationships and channels built by Teams to carefully extract the patterns—removing organization-specific information and sensitive data while preserving what makes the solution work.",
    details: "What makes this possible is the trust and infrastructure built through embedded partnerships. Organizations know their investment strengthens the sector while their specific context stays protected. Solutions spread because they emerged from actual use, not theoretical design.",
    items: [
      "Solutions proven through daily use before being generalized",
      "Individual investments become collective sector resources",
      "Open licensing ensures tools stay with the community, not companies"
    ],
    quote: "What emerges from embedded work carries weight—it's been tested, refined, shaped by the people doing the work. Open licensing means it stays with the community."
  },
  {
    id: "labs",
    icon: Sprout,
    iconColor: "text-orange",
    label: "Building Local Capacity",
    title: "PAL Labs",
    description: "PAL Labs extends technical capacity to organizations through supervised placements—connecting emerging talent with real project needs while building on the relationships and infrastructure Teams has already established.",
    highlightWords: ["supervised placements"],
    secondaryDescription: "Labs operates on the foundation Teams creates. The organizational understanding, the trusted relationships, the technical infrastructure—all become the base for meaningful placements. A student generalizes an existing solution for sector-wide use. A newcomer builds custom tools for unique program needs. Someone transitioning careers creates data infrastructure. Different people, different skills, same structure: learn in our environments under mentorship, apply those skills where they're needed, leave something maintainable behind.",
    details: "We gather funding from foundations, government, and larger organizations who understand the sector-wide benefit—pooling resources to run lean cohorts where technical talent learns specialized skills. The technical work is sophisticated—data engineering, cloud architecture, custom development—but connected to frontline reality through existing relationships. That messy data isn't abstract; it represents real people receiving real services.",
    items: [
      "Emerging talent learns specialized skills, then applies them to community needs",
      "Projects build on Teams' existing infrastructure and relationships",
      "Funded collectively by stakeholders who benefit from a stronger ecosystem"
    ],
    quote: "A Waterloo engineering student completed his co-op term locally through PALcares. Working in our environment first under mentorship, then with real data—cleaning years of messy information to answer a specific operational question under a deadline. The organization gets critical capacity they couldn't otherwise afford. The student sees his technical expertise applied in the social service sector on his own community."
  }
];

// Ecosystem diagram node data
export const ECOSYSTEM_NODES = {
  research: {
    icon: BookOpen,
    color: "text-research",
    label: "Research",
    description: "Generalizes & shares under open license"
  },
  teams: {
    icon: Users,
    color: "text-teams",
    label: "Teams", 
    description: "Foundational work, relationships & infrastructure"
  },
  labs: {
    icon: FlaskConical,
    color: "text-orange",
    label: "Labs",
    description: "Extends capacity, builds on foundation"
  }
} as const;

// Particle animation configs for ecosystem diagram
export const ECOSYSTEM_PARTICLES = [
  { r: 3, delay: 0.0, duration: 4.6, startX: 300, startY: 42, endX: 120, endY: 210 },
  { r: 2.5, delay: 1.2, duration: 4.9, startX: 120, startY: 210, endX: 300, endY: 42 },
  { r: 3, delay: 0.6, duration: 4.7, startX: 300, startY: 42, endX: 480, endY: 210 },
  { r: 2.5, delay: 1.8, duration: 5.0, startX: 480, startY: 210, endX: 300, endY: 42 },
  { r: 2.75, delay: 0.3, duration: 4.4, startX: 120, startY: 210, endX: 480, endY: 210 },
  { r: 2.75, delay: 1.5, duration: 4.6, startX: 480, startY: 210, endX: 120, endY: 210 }
] as const;
