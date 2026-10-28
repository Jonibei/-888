"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { surveyQuestionCount, surveySections, type SurveyAnswers, type SurveyQuestion } from "@/lib/survey";

type AnswerValue = string | string[] | Record<string, string | string[]> | undefined;

function QuestionControl({ question, value, onChange }: { question: SurveyQuestion; value: AnswerValue; onChange: (value: string | string[] | Record<string, string | string[]>) => void }) {
  if (question.kind === "text") {
    return <textarea data-testid={`survey-input-${question.id}`} value={typeof value === "string" ? value : ""} onChange={(event) => onChange(event.target.value)} placeholder={question.placeholder} maxLength={3000} rows={5} />;
  }
  if (question.kind === "matrix") {
    const matrix = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, string | string[]> : {};
    return <div className="survey-matrix">{question.rows?.map((row, rowIndex) => {
      const current = matrix[row];
      if (question.perRowMultiple) {
        const selected = Array.isArray(current) ? current : [];
        return <details className="survey-matrix-row" key={row}>
          <summary data-testid={`survey-matrix-summary-${question.id}-${rowIndex + 1}`}><span>{row}</span><small>{selected.length ? `已选 ${selected.length} 项` : "选择参与角色"}</small></summary>
          <div className="survey-options survey-matrix-options">{question.options?.map((option, optionIndex) => <button key={option} type="button" aria-pressed={selected.includes(option)} className={`survey-option${selected.includes(option) ? " is-selected" : ""}`} data-testid={`survey-option-${question.id}-${rowIndex + 1}-${optionIndex + 1}`} onClick={() => {
            const next = selected.includes(option) ? selected.filter((item) => item !== option) : selected.length < (question.perRowMax ?? 8) ? [...selected, option] : selected;
            onChange({ ...matrix, [row]: next });
          }}><span>{option}</span>{selected.includes(option) && <Check size={16} aria-hidden="true" />}</button>)}</div>
        </details>;
      }
      return <label className="survey-matrix-select" key={row}><span>{row}</span><select value={typeof current === "string" ? current : ""} onChange={(event) => onChange({ ...matrix, [row]: event.target.value })} data-testid={`survey-select-${question.id}-${rowIndex + 1}`}><option value="">请选择</option>{question.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
    })}</div>;
  }
  const selected = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
  const toggle = (option: string) => {
    if (question.kind === "single") onChange(option);
    else if (selected.includes(option)) onChange(selected.filter((item) => item !== option));
    else if (!question.max || selected.length < question.max) onChange([...selected, option]);
  };
  return <div className="survey-options" role={question.kind === "single" ? "radiogroup" : "group"} aria-label={question.prompt}>
    {question.options?.map((option, index) => {
      const active = selected.includes(option);
      return <button key={option} type="button" aria-pressed={active} className={`survey-option${active ? " is-selected" : ""}`} onClick={() => toggle(option)} data-testid={`survey-option-${question.id}-${index + 1}`}>
        <span>{option}</span>{active && <Check size={18} aria-hidden="true" />}
      </button>;
    })}
  </div>;
}

export function SurveyForm() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const section = surveySections[sectionIndex];
  const answered = Object.values(answers).filter((answer) => Array.isArray(answer) ? answer.length > 0 : typeof answer === "string" ? answer.trim().length > 0 : Object.values(answer).every((cell) => Array.isArray(cell) ? cell.length > 0 : Boolean(cell))).length;
  const update = (id: string, value: string | string[] | Record<string, string | string[]>) => setAnswers((previous) => ({ ...previous, [id]: value }));

  const goNext = () => {
    const missing = section.questions.some((question) => {
      if (question.optional) return false;
      const answer = answers[question.id];
      if (question.kind === "matrix") {
        if (!answer || typeof answer !== "object" || Array.isArray(answer)) return true;
        const matrix = answer as Record<string, string | string[]>;
        return question.rows?.some((row) => {
          const cell = matrix[row];
          return !cell || (Array.isArray(cell) && cell.length === 0);
        }) ?? true;
      }
      return answer === undefined || answer === "" || (Array.isArray(answer) && answer.length === 0);
    });
    if (missing) {
      setError("还有必答问题未完成，请选择一个答案后继续。");
      return;
    }
    setError("");
    setSectionIndex((current) => Math.min(current + 1, surveySections.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/survey", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ answers, honeypot }) });
      if (!response.ok) throw new Error(response.status === 503 ? "问卷暂未连接数据表，请稍后再试。" : "提交没有成功，请检查网络后重试。");
      setSubmitted(true);
    } catch (reason) {
      setConnectionError(true);
      setError(reason instanceof Error ? reason.message : "提交失败，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return <main className="survey-shell" data-testid="survey-status-success"><div className="survey-backdrop"><i /><i /><i /></div><section className="survey-card survey-thanks"><div className="survey-icon"><Check size={26} /></div><p className="survey-kicker">THANK YOU · 感谢参与</p><h1>你的经验，<br />会让协作更好一点。</h1><p>问卷已提交。感谢你分享真实的工作感受。</p><Link className="survey-primary" href="/survey/analysis" data-testid="survey-link-analysis">查看数据分析 <ArrowRight size={18} /></Link></section></main>;

  return <main id="main" className="survey-shell" data-testid="survey-page">
    <div className="survey-backdrop" aria-hidden="true"><i /><i /><i /><i /></div>
    <header className="survey-top"><Link href="/survey" className="survey-brand" data-testid="survey-link-home"><span className="survey-brand-mark"><Sparkles size={16} /></span>一起聊聊设计协作</Link><Link href="/survey/analysis" className="survey-analysis-link" data-testid="survey-link-analysis-top">数据图表 <ArrowRight size={15} /></Link></header>
    <section className="survey-intro">
      <p className="survey-kicker">A SMALL SURVEY FOR DESIGNERS</p>
      <h1>让我们了解<br /><em>你</em>的工作日常。</h1>
      <p className="survey-intro-copy">关于视觉设计、跨部门协作，以及 AI 如何走进你的工作。</p>
      <div className="survey-meta"><span>约 6 分钟</span><span className="survey-meta-dot" /><span>共 5 个部分</span><span className="survey-meta-dot" /><span>匿名填写</span></div>
      <a href="#survey-content" className="survey-scroll" aria-label="开始填写问卷"><ArrowDown size={19} /></a>
    </section>
    <section id="survey-content" className="survey-card" aria-labelledby="survey-section-title">
      <div className="survey-progress-row"><span>第 {sectionIndex + 1} / {surveySections.length} 部分</span><span>已完成 {answered} / {surveyQuestionCount}</span></div>
      <div className="survey-progress"><span style={{ width: `${((sectionIndex + 1) / surveySections.length) * 100}%` }} /></div>
      <div className="survey-section-heading"><p className="survey-kicker">{section.eyebrow}</p><h2 id="survey-section-title">{section.title}</h2><p>{section.description}</p></div>
      {section.questions.map((question) => <fieldset className="survey-question" key={question.id}>
        <legend><span className="survey-question-number">{String(section.questions.indexOf(question) + 1 + surveySections.slice(0, sectionIndex).reduce((sum, item) => sum + item.questions.length, 0)).padStart(2, "0")}</span>{question.prompt}{question.optional && <small>选填</small>}</legend>
        {(question.kind === "multiple" || question.kind === "matrix") && <p className="survey-hint">{question.kind === "matrix" ? "请为每个阶段分别填写" : `可多选${question.max ? ` · 最多 ${question.max} 项` : ""}`}</p>}
        <QuestionControl question={question} value={answers[question.id]} onChange={(value) => update(question.id, value)} />
      </fieldset>)}
      <label className="survey-honeypot" aria-hidden="true">Leave this empty<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} data-testid="survey-input-honeypot" /></label>
      {error && <p className="survey-error" role="alert" data-testid="survey-status-error">{error}</p>}
      {connectionError && <p className="survey-privacy-note" data-testid="survey-status-connection">你的答案尚未送出，请稍后重试；页面保留了当前填写内容。</p>}
      <div className="survey-actions">
        {sectionIndex > 0 && <button className="survey-secondary" type="button" onClick={() => { setSectionIndex((current) => current - 1); setError(""); }} data-testid="survey-btn-back"><ArrowLeft size={17} /> 上一部分</button>}
        {sectionIndex < surveySections.length - 1 ? <button className="survey-primary" type="button" onClick={goNext} data-testid="survey-btn-next">继续填写 <ArrowRight size={18} /></button> : <button className="survey-primary" type="button" onClick={submit} disabled={submitting} data-testid="survey-btn-submit">{submitting ? "正在提交…" : "提交问卷"} <ArrowRight size={18} /></button>}
      </div>
      <p className="survey-privacy-note">问卷不要求姓名和联系方式。开放题请勿填写可识别个人的信息；回答仅用于了解设计团队协作与 AI 使用情况。</p>
    </section>
    <footer className="survey-footer"><span>DESIGN × COLLABORATION × AI</span><span>感谢你留下真实的声音</span></footer>
  </main>;
}
