import {
  HeartHandshake,
  ShieldCheck,
  Database,
  Sprout,
  Users,
  BookOpen,
  FlaskConical,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  HeartHandshake,
  ShieldCheck,
  Database,
  Sprout,
  Users,
  BookOpen,
  FlaskConical,
};

export function getIcon(name: string): LucideIcon {
  const icon = iconMap[name];
  if (!icon) {
    throw new Error(`Unknown icon: ${name}. Add it to app/lib/icon-map.ts`);
  }
  return icon;
}
