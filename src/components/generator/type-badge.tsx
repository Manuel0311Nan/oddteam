import type { TypeName } from "@/lib/types";
import { TYPE_COLORS } from "@/lib/ui/labels";

export function TypeBadge({ type, name }: { type: TypeName; name: string }) {
  const c = TYPE_COLORS[type];
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-bold"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {name}
    </span>
  );
}
