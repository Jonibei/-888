import { describe, expect, it } from "vitest";
import { portfolio } from "../fixtures/portfolio";
import { categoryPath, categorySlugs, findCategory } from "./portfolio";
describe("作品配置与浏览地址", () => {
  it("五类地址稳定，三十个作品 ID 唯一且归属正确", () => {
    expect(portfolio.categories.map(item => item.slug)).toEqual([...categorySlugs]);
    const ids = new Set<string>();
    for (const category of portfolio.categories) {
      expect(category.works).toHaveLength(6);
      expect(categoryPath(category.slug)).toBe(`/works/${category.slug}`);
      for (const work of category.works) {
        expect(work.categorySlug).toBe(category.slug);
        expect(work.status).toBe("placeholder");
        ids.add(work.id);
      }
    }
    expect(ids.size).toBe(30);
  });
  it("未知地址不误匹配有效分类", () => {
    for (const slug of ["unknown", "", "category-6", "../category-1"]) expect(findCategory(portfolio.categories, slug)).toBeUndefined();
  });
  it("显示名称改动不改变地址与其他分类，有效空集合仍能查找", () => {
    const changed = portfolio.categories.map((item, index) => index ? item : { ...item, name:"新名称", works:[] });
    expect(findCategory(changed, "category-1")?.name).toBe("新名称");
    expect(findCategory(changed, "category-1")?.works).toEqual([]);
    expect(categoryPath(changed[0].slug)).toBe("/works/category-1");
    expect(changed.slice(1)).toEqual(portfolio.categories.slice(1));
    expect(portfolio.categories[0].works).toHaveLength(6);
  });
});
