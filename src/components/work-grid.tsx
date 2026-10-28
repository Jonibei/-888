import type { Work } from "@/lib/portfolio";
export function WorkCard({ work }: { work: Work }) {
  return <article className="work-card" data-testid={`category-item-work-${work.id}`}>
    <div className="work-cover" aria-hidden="true"><span>作品封面占位</span></div>
    <div className="pt-6"><div className="flex flex-wrap justify-between items-start gap-4"><h2>{work.title}</h2><span className="status-label" data-testid={`category-status-placeholder-${work.id}`}>作品待更新</span></div><p className="muted small mt-4">{work.description}</p></div>
  </article>;
}
export function WorkGrid({ works }: { works: readonly Work[] }) {
  return works.length ? <div data-testid="category-list-works" className="portfolio-grid">{works.map(work => <WorkCard key={work.id} work={work} />)}</div>
    : <p className="empty-state" data-testid="category-status-empty">该类目作品待更新</p>;
}
