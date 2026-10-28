import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
export const metadata: Metadata = { title: { default: "Zier Min · 视觉设计与 AI 创意", template: "%s · Zier Min" }, description: "Zier Min 的个人作品集，探索视觉设计与 AI 创意。" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><a className="skip-link" href="#main" data-testid="layout-link-skip-main">跳到主内容</a><SiteHeader />{children}<footer className="shell site-footer"><span>黑场 / 视觉与 AI 创意</span><span>内容占位，待更新</span></footer></body></html>;
}
