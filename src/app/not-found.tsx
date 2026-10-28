import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound() {
  return <main id="main" tabIndex={-1} className="shell not-found"><p className="eyebrow">404 / NOT FOUND</p><h1 data-testid="notfound-status-message">页面未找到</h1><p className="muted mt-8">这个页面不存在，你可以返回首页继续浏览作品分类。</p><Link className="back-link" href="/" data-testid="notfound-link-home"><ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />返回首页</Link></main>;
}
