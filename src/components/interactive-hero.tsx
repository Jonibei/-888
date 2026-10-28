"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";

// 所有分层坐标基于原始素材，悬停结束后能准确拼回选定的画面。
const tools = [
  { id:"figma", name:"Figma", x:42, y:14, path:"M344 182 Q354 96 413 103 L556 139 Q610 150 595 212 L563 322 L481 332 L401 344 L326 303 Z" },
  { id:"codex", name:"Codex", x:24, y:22, path:"M157 223 Q181 209 216 225 L365 281 Q411 298 392 346 Q383 387 347 380 L169 332 Q118 321 134 274 Z" },
  { id:"lovart", name:"Lovart", x:76, y:17, path:"M755 219 L918 161 Q956 148 972 187 L978 225 Q977 254 953 268 L777 316 Q745 320 730 288 L722 260 Q718 236 755 219 Z" },
  { id:"jimeng", name:"即梦", x:80, y:28, path:"M804 297 Q825 282 854 288 L1002 320 Q1062 332 1050 383 L1029 461 Q1023 495 992 490 L750 454 L771 354 Q778 312 804 297 Z" },
] as const;
const outline = "M0 0H1122V515L1010 495L840 464L675 478L505 458L337 417L168 378L0 338Z";

export function InteractiveHero() {
  const [phase, setPhase] = useState("loading");
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [contactVisible, setContactVisible] = useState(false);
  const section = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    let alive = true;
    let frame = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    // 一帧最多写一次样式；锚点跳转、回滚时也按真实滚动位置恢复画面。
    function updateScroll() {
      frame = 0;
      if (!section.current || !scene.current) return;
      const bounds = section.current.getBoundingClientRect();
      const progress = reduced.current ? 0 : Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height - innerHeight)));
      scene.current.style.setProperty("--travel", String(progress));
      scene.current.style.setProperty("--flip", `${Math.max(0, (progress - .42) / .58) * 155}deg`);
      scene.current.style.setProperty("--exit", String(Math.max(0, (progress - .88) / .12)));
      scene.current.dataset.progress = progress.toFixed(3);
    }
    const updatePreference = () => { reduced.current = preference.matches; updateScroll(); };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(updateScroll); };
    reduced.current = preference.matches;
    const images = ["/hero/zier-open.png", "/hero/zier-closed.png"].map(src => new Promise<void>(resolve => {
      const image = new Image(); image.onload = () => resolve(); image.onerror = () => resolve(); image.src = src;
    }));
    void Promise.all(images).then(() => {
      if (!alive) return;
      setPhase(preference.matches ? "ready" : "entering");
      if (!preference.matches) timers.push(setTimeout(() => { if (alive) setPhase("ready"); }, 1250));
    });
    updateScroll();
    addEventListener("scroll", scroll, { passive:true }); addEventListener("resize", scroll);
    preference.addEventListener("change", updatePreference);
    return () => {
      alive = false; timers.forEach(clearTimeout); cancelAnimationFrame(frame);
      removeEventListener("scroll", scroll); removeEventListener("resize", scroll);
      preference.removeEventListener("change", updatePreference);
    };
  }, []);

  function gaze(x:number, y:number) {
    if (reduced.current) return;
    scene.current?.style.setProperty("--gaze-x", `${x}px`);
    scene.current?.style.setProperty("--gaze-y", `${y}px`);
  }
  function move(event:PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const overTool = event.target instanceof Element && event.target.closest(".zier-tool-target");
    gaze(Math.max(-4, Math.min(4, ((event.clientX - bounds.left) / bounds.width - .5) * 8)), overTool ? -3 : Math.max(-3, Math.min(3, ((event.clientY - bounds.top) / bounds.height - .6) * 6)));
  }
  function selectTool(id:string | null) { setActiveTool(id); gaze(0, id ? -3 : 0); }

  return <section ref={section} className="zier-scroll-story" data-testid="hero-story">
    <div ref={scene} className="zier-hero" aria-label="Zier Min 互动首页" data-testid="hero-section" data-phase={phase} data-active-tool={activeTool ?? ""} onPointerMove={move} onPointerLeave={() => gaze(0, 0)}>
      <div className="zier-topbar"><span className="zier-wordmark">Zier Min</span><nav aria-label="首页导航">
        <a href="#works" data-testid="hero-link-work">Work</a><a href="#about" data-testid="hero-link-about">About</a>
        <button type="button" className="zier-contact" aria-expanded={contactVisible} aria-controls="hero-contact" data-testid="hero-btn-contact" onClick={() => setContactVisible(value => !value)}>Contact <ArrowUpRight size={14} aria-hidden="true" /></button>
      </nav></div>
      {contactVisible && <div id="hero-contact" className="zier-contact-note" role="status" data-testid="hero-status-contact">联系方式即将补充</div>}
      <h1 className="zier-title">Zier Min</h1>
      <div className="zier-stage" data-testid="hero-stage"><div className="zier-entrance"><div className="zier-flipper">
        <div className="zier-front">
          <div className="zier-portrait" role="img" aria-label="Zier Min 头像与白色撕纸边，头顶展现四种创作工具">
            <svg className="zier-face-sliced" viewBox="0 0 1122 1402" aria-hidden="true"><defs><clipPath id="face-only"><path d={`M0 0H1122V1402H0Z ${outline}`} clipRule="evenodd" /></clipPath></defs><image href="/hero/zier-open.png" width="1122" height="1402" clipPath="url(#face-only)" /></svg><div className="zier-eyes" aria-hidden="true" data-testid="hero-eyes" /><div className="zier-cap" aria-hidden="true" />
          </div>
          <svg className="zier-tools" viewBox="0 0 1122 1402" aria-hidden="true" data-testid="hero-tools">
            <defs>
              <clipPath id="tool-cavity"><path d={[outline, ...tools.map(tool => tool.path)].join(" ")} clipRule="evenodd" /></clipPath>
              {tools.map(tool => <clipPath id={`clip-${tool.id}`} key={tool.id}><path d={tool.path} /></clipPath>)}
            </defs>
            {tools.map(tool => <path key={tool.id} d={tool.path} fill={activeTool === tool.id ? "#17141a" : "transparent"} />)}
            <image href="/hero/zier-open.png" width="1122" height="1402" clipPath="url(#tool-cavity)" />
            {tools.map(tool => <g key={tool.id} className="zier-tool-piece" data-active={activeTool === tool.id} data-testid={`hero-art-${tool.id}`}><image href="/hero/zier-open.png" width="1122" height="1402" clipPath={`url(#clip-${tool.id})`} /></g>)}
          </svg>
          <div className="zier-tool-targets" aria-label="创作工具">
            {tools.map(tool => <button key={tool.id} type="button" className="zier-tool-target" style={{left:`${tool.x}%`, top:`${tool.y}%`}} aria-label={`了解 ${tool.name}`} aria-describedby={activeTool === tool.id ? `label-${tool.id}` : undefined} data-testid={`hero-btn-tool-${tool.id}`} onPointerEnter={() => selectTool(tool.id)} onPointerLeave={() => selectTool(null)} onFocus={() => selectTool(tool.id)} onBlur={() => selectTool(null)} onClick={() => selectTool(tool.id)}>
              <span className="zier-tool-label" id={`label-${tool.id}`} role="tooltip" hidden={activeTool !== tool.id}>{tool.name}</span>
            </button>)}
          </div>
        </div>
        <div className="zier-back" aria-hidden="true"><span>LET’S<br />CREATE.</span><small>ZIER MIN — SELECTED WORK</small></div>
      </div></div></div>
      <div className="zier-caption"><p>Visual design × AI</p><a href="#works" data-testid="hero-link-selected">Selected work</a></div>
      <a href="#works" className="zier-scroll" data-testid="hero-link-scroll"><span>Scroll to explore</span><ArrowDown size={32} strokeWidth={1} aria-hidden="true" /></a>
    </div>
  </section>;
}
