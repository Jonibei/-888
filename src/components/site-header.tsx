"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { portfolio } from "@/fixtures/portfolio";
import { categoryPath } from "@/lib/portfolio";

export function SiteHeader() {
  const pathname = usePathname();
  return <header className={`site-header${pathname === "/" ? " site-header-secondary" : ""}`}>
    <div className="shell header-inner">
      <div className="brand" aria-label="黑场作品集"><span aria-hidden="true" className="brand-mark" />黑场<span className="brand-sub"> / PORTFOLIO</span></div>
      <nav aria-label="主导航" data-testid="layout-nav-primary" className="nav-links">
        <Link href="/" data-testid="layout-link-home" aria-current={pathname === "/" ? "page" : undefined}>首页</Link>
        {portfolio.categories.map(category => <Link key={category.slug} href={categoryPath(category.slug)} data-testid={`layout-link-category-${category.slug}`} aria-current={pathname === categoryPath(category.slug) ? "page" : undefined}>{category.name}</Link>)}
      </nav>
    </div>
  </header>;
}
