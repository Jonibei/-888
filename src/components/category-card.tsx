import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categoryPath, type Category } from "@/lib/portfolio";
export function CategoryCard({ category, number }: { category: Category; number: number }) {
  return <Link href={categoryPath(category.slug)} data-testid={`home-link-category-${category.slug}`} className="category-card group">
    <div aria-hidden="true" className="category-cover"><span className="cover-number">{String(number).padStart(2, "0")}</span><span className="cover-label">设计作品集</span></div>
    <div className="flex items-center justify-between gap-4 p-6"><div><h3>{category.name}</h3><p className="muted small mt-2">{String(category.works.length).padStart(2, "0")} 个作品位置</p></div><ArrowUpRight aria-hidden="true" size={20} strokeWidth={1.5} /></div>
  </Link>;
}
