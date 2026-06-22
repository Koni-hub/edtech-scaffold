"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground"
    >
      <Link
        href="/dashboard"
        className="shrink-0 hover:text-foreground transition-colors"
      >
        <Home size={14} />
      </Link>

      {items.map((item, i) => (
        <div key={i} className="flex min-w-0 items-center gap-1">
          <ChevronRight size={12} className="shrink-0" />

          {item.href ? (
            <Link
              href={item.href}
              className="truncate hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="min-w-0 truncate font-medium text-foreground">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
