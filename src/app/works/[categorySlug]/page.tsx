import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { portfolio } from "@/fixtures/portfolio";
import { findCategory } from "@/lib/portfolio";
import { WorkGrid } from "@/components/work-grid";
type Props = { params: Promise<{ categorySlug: string }> };
export function generateStaticParams() { return portfolio.categories.map(category => ({ categorySlug: category.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = findCategory(portfolio.categories, (await params).categorySlug);
  return { title: category?.name ?? "页面未找到" };
}
export default async function CategoryPage({ params }: Props) {
  const category = findCategory(portfolio.categories, (await params).categorySlug);
  if (!category) notFound();
  return <main id="main" tabIndex={-1} className="shell"><section className="category-heading"><p className="eyebrow">SELECTED WORKS / 设计作品集</p><h1 data-testid="category-status-title">{category.name}</h1><div className="hero-bottom"><p className="muted intro" data-testid="category-status-description-placeholder">{category.description}</p><span className="status-label">内容占位，待更新</span></div></section><section className="collection" aria-label={`${category.name}作品`}><WorkGrid works={category.works} /></section></main>;
}
