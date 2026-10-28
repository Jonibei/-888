"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, BarChart3, RefreshCw } from "lucide-react";
import { surveySections, type SurveyQuestion } from "@/lib/survey";

type Summary = { total: number; items?: Record<string, Record<string, number>> };
const analysisGroups: { id: string; title: string; questions: SurveyQuestion[] }[] = [
  { id: "profile", title: "基本情况与公司", questions: [...surveySections[0].questions] },
  { id: "flow", title: "项目协作与 AI 使用", questions: [...surveySections[1].questions, ...surveySections[2].questions] },
  { id: "revision", title: "项目修改与能力变化", questions: [...surveySections[3].questions, ...surveySections[4].questions].filter((question) => question.id !== "q26") },
];

function ChartCard({ question, data, total }: { question: SurveyQuestion; data?: Record<string, number>; total: number }) {
  const rows = Object.entries(data ?? {}).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...rows.map(([, count]) => count));
  const questionNumber = question.id.slice(1);
  const isStageMetric = ["q8", "q9", "q10"].includes(question.id);
  const summary = rows.find(([, count]) => count > 0);
  return <section className="analysis-card" data-testid={`analysis-chart-${question.id}`} aria-label={`第 ${questionNumber} 题：${question.prompt}`}>
    <p className="analysis-question-id">Q{questionNumber}</p><h3>{question.prompt}</h3>
    <p className="analysis-note">{isStageMetric ? "按项目阶段累计回答次数" : question.kind === "multiple" ? "多选题 · 每份问卷按选项计数" : "单选题 · 回答份数"}</p>
    {total > 0 && rows.length ? <div className="analysis-bars">{rows.map(([label, value]) => <div className="analysis-bar-row" key={label}><div className="analysis-label"><span>{label}</span><strong>{value}</strong></div><div className="analysis-bar-track"><span style={{ width: `${value ? Math.max(6, (value / max) * 100) : 0}%` }} /></div></div>)}</div> : <div className="analysis-empty"><BarChart3 size={22} /><span>收到有效问卷后，这里会自动汇总。</span></div>}
    {summary && <p className="analysis-chart-summary">「{summary[0]}」目前最多，共 {summary[1]} 次。</p>}
  </section>;
}

export function SurveyAnalysis() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "unconfigured" | "error">("loading");
  const [error, setError] = useState("");
  const fetchSummary = async () => {
    try {
      const response = await fetch("/api/survey", { cache: "no-store" });
      const data = await response.json();
      if (response.status === 503) { setStatus("unconfigured"); return; }
      if (!response.ok) throw new Error(data.error ?? "读取失败");
      setSummary(data);
      setStatus(data.total > 0 ? "ready" : "empty");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "数据暂时不可用");
      setStatus("error");
    }
  };
  const load = () => { setStatus("loading"); void fetchSummary(); };
  useEffect(() => {
    let active = true;
    fetch("/api/survey", { cache: "no-store" })
      .then(async (response) => ({ response, data: await response.json() }))
      .then(({ response, data }) => {
        if (!active) return;
        if (response.status === 503) { setStatus("unconfigured"); return; }
        if (!response.ok) throw new Error(data.error ?? "读取失败");
        setSummary(data);
        setStatus(data.total > 0 ? "ready" : "empty");
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "数据暂时不可用");
        setStatus("error");
      });
    return () => { active = false; };
  }, []);
  return <main className="survey-shell analysis-shell" data-testid="analysis-page">
    <div className="survey-backdrop" aria-hidden="true"><i /><i /><i /></div>
    <header className="survey-top"><Link href="/survey" className="survey-brand"><span className="survey-brand-mark"><BarChart3 size={16} /></span>问卷数据看板</Link><Link href="/survey" className="survey-analysis-link" data-testid="analysis-link-survey"><ArrowLeft size={15} /> 返回问卷</Link></header>
    <section className="analysis-heading"><p className="survey-kicker">LIVE RESPONSE OVERVIEW</p><h1>一起看看<br /><em>大家怎么想。</em></h1><p>汇总全部选择题；开放回答只保存在数据表，不在看板展示。</p></section>
    <section className="analysis-count" data-testid="analysis-total"><span>当前有效样本</span><strong>{summary?.total ?? "—"}</strong><small>份问卷</small><button type="button" className="analysis-refresh" onClick={() => void load()} aria-label="刷新分析数据" data-testid="analysis-btn-refresh"><RefreshCw size={16} /> 刷新</button></section>
    {status === "loading" && <p className="analysis-state" data-testid="analysis-status-loading">正在读取汇总数据…</p>}
    {status === "unconfigured" && <div className="analysis-state analysis-state-callout" data-testid="analysis-status-unconfigured"><strong>数据表还没有连接</strong><span>部署 Google Apps Script Web App，并在服务端配置 URL 和共享令牌后，提交和全题分析会自动启用。</span></div>}
    {status === "error" && <p className="analysis-state analysis-error" role="alert" data-testid="analysis-status-error">{error}</p>}
    {(status === "ready" || status === "empty") && <div className="analysis-groups" data-testid="analysis-charts">{analysisGroups.map((group, index) => <details className="analysis-group" key={group.id} open={index === 0} data-testid={`analysis-group-${group.id}`}><summary><span>{group.title}</span><small>{group.questions.length} 项分析</small></summary><div className="analysis-charts">{group.questions.map((question) => <ChartCard key={question.id} question={question} data={summary?.items?.[question.id]} total={summary?.total ?? 0} />)}</div></details>)}</div>}
    <p className="analysis-footnote">看板仅显示汇总数量，不显示个人作答内容。</p>
  </main>;
}
