import { categorySlugs, type Portfolio } from "../lib/portfolio";

const names = ["类目一", "类目二", "类目三", "类目四", "类目五"];
// 所有占位内容集中在此；灰块表示内容待补充，而不是网络正在加载。
export const portfolio: Portfolio = {
  introduction: {
    title: "让创意在黑场中被看见。",
    description: "视觉设计 / AI 创意。这里是我的个人作品集，个人介绍与作品内容即将更新。",
  },
  categories: categorySlugs.map((slug, index) => ({
    slug, name: names[index], description: "此类目的设计方向与创作说明待补充。",
    works: Array.from({ length: 6 }, (_, workIndex) => ({
      id: `${slug}-work-${workIndex + 1}`, categorySlug: slug,
      title: `作品 ${String(workIndex + 1).padStart(2, "0")}`,
      description: "作品名称、创作背景与设计说明待补充。", status: "placeholder" as const,
    })),
  })),
};
