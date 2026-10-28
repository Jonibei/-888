import { portfolio } from "@/fixtures/portfolio";
import { CategoryCard } from "@/components/category-card";
import { InteractiveHero } from "@/components/interactive-hero";
export default function Home() {
  return <main id="main" tabIndex={-1} className="zier-home">
    <InteractiveHero />
    <div className="shell">
    <section id="works" className="collection" aria-labelledby="collection-title"><div className="section-heading"><h2 id="collection-title">作品分类<span className="muted section-count"> / 05</span></h2><p className="muted small">选择一个类目，探索创作方向</p></div>
      {portfolio.categories.length ? <div data-testid="home-list-categories" className="portfolio-grid">{portfolio.categories.map((category, index) => <CategoryCard key={category.slug} category={category} number={index + 1} />)}</div> : <p className="empty-state">类目待更新</p>}
    </section>
    <section id="about" className="zier-about" data-testid="home-status-introduction-placeholder"><p className="eyebrow">ABOUT / 关于</p><h2>Zier Min</h2><p className="muted intro">视觉设计与 AI 创意探索。{portfolio.introduction.description}</p></section>
    </div>
  </main>;
}
