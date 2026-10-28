export const categorySlugs = ["category-1", "category-2", "category-3", "category-4", "category-5"] as const;
export type CategorySlug = (typeof categorySlugs)[number];
export type Work = Readonly<{ id: string; categorySlug: CategorySlug; title: string; description: string; status: "placeholder" }>;
export type Category = Readonly<{ slug: CategorySlug; name: string; description: string; works: readonly Work[] }>;
export type Portfolio = Readonly<{ introduction: Readonly<{ title: string; description: string }>; categories: readonly Category[] }>;

// 展示名称后续可以修改；分享地址始终使用稳定 slug，避免旧链接失效。
export function categoryPath(slug: CategorySlug) { return `/works/${slug}`; }
export function findCategory(categories: readonly Category[], slug: string) {
  return categories.find((category) => category.slug === slug);
}
