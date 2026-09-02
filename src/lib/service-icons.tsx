import {
  BatteryCharging,
  Gauge,
  LifeBuoy,
  MapPin,
  Radio,
  ShieldCheck,
  Sparkles,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "battery-charging": BatteryCharging,
  "life-buoy": LifeBuoy,
  zap: Zap,
  radio: Radio,
  gauge: Gauge,
  wind: Wind,
  "map-pin": MapPin,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Wrench;
  return <Icon className={className} aria-hidden="true" />;
}
