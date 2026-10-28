export type SurveyQuestion = {
  id: string;
  prompt: string;
  kind: "single" | "multiple" | "matrix" | "text";
  options?: string[];
  rows?: string[];
  perRowMultiple?: boolean;
  perRowMax?: number;
  optional?: boolean;
  max?: number;
  placeholder?: string;
};

export const surveySections = [
  {
    id: "profile",
    title: "基本信息",
    eyebrow: "PART 01 · ABOUT YOU",
    description: "先认识你的工作环境与角色。",
    questions: [
      { id: "q1", prompt: "你目前主要从事哪类视觉设计？", kind: "single", options: ["品牌 / 平面设计", "UI / 界面设计", "电商 / 营销设计", "动效 / 视频设计", "其他"] },
      { id: "q2", prompt: "你所在公司的规模大约是？", kind: "single", options: ["20 人以下", "20–99 人", "100–499 人", "500–2000 人", "2000 人以上", "不清楚"] },
      { id: "q3", prompt: "你从事视觉设计工作的年限？", kind: "single", options: ["不到 1 年", "1–3 年", "3–5 年", "5–8 年", "8 年以上"] },
      { id: "q4", prompt: "你在团队中通常担任什么角色？", kind: "single", options: ["执行设计师", "独立负责项目", "设计负责人 / 管理者", "其他"] },
      { id: "q5", prompt: "你目前使用 AI 的频率或深度？", kind: "single", options: ["基本不使用", "偶尔生成素材", "日常生成并编辑", "已融入设计工作流", "会配置或编排 AI Agent"] },
      { id: "q6", prompt: "公司主要服务哪些行业？（最多选 3 项）", kind: "multiple", max: 3, options: ["互联网 / 科技", "消费 / 零售", "教育", "金融", "医疗健康", "旅游 / 文旅", "制造业", "公共服务", "其他"] },
      { id: "q7", prompt: "公司是否搭建了自己的 AI Agent？", kind: "single", options: ["已投入使用", "正在试点", "计划搭建", "没有", "不清楚"] },
    ] as SurveyQuestion[],
  },
  {
    id: "project-flow",
    title: "项目如何开始",
    eyebrow: "PART 02 · PROJECT FLOW",
    description: "回想最近一个完成的项目，了解组内如何沟通、AI 参与到哪里。",
    questions: [
      { id: "q8", prompt: "最近一个完成的项目里，每个阶段通常由谁参与？", kind: "matrix", rows: ["需求接收", "方向讨论", "首稿制作", "组内评审", "跨部门对齐", "修改迭代", "交付上线"], perRowMultiple: true, perRowMax: 4, options: ["我自己", "设计组成员", "设计负责人", "其他部门", "外部供应商", "客户 / 需求方", "AI Agent", "共同负责", "其他"] },
      { id: "q9", prompt: "这些项目阶段中，AI 大约承担多少工作？", kind: "matrix", rows: ["需求接收", "方向讨论", "首稿制作", "组内评审", "跨部门对齐", "修改迭代", "交付上线"], options: ["没有使用", "不到 25%", "25%–50%", "51%–75%", "超过 75%", "不确定"] },
      { id: "q10", prompt: "每个阶段主要会对接哪些部门或角色？", kind: "matrix", rows: ["需求接收", "方向讨论", "首稿制作", "组内评审", "跨部门对齐", "修改迭代", "交付上线"], perRowMultiple: true, perRowMax: 4, options: ["运营", "市场", "产品 / 项目经理", "研发 / 技术", "设计负责人", "客户", "供应商 / 印厂", "没有固定对接对象"] },
      { id: "q11", prompt: "项目刚下达时，组内通常如何沟通协作？", kind: "multiple", max: 5, options: ["项目启动会", "即时通讯群", "项目管理工具", "需求 / 评审文档", "直接找相关同事沟通", "没有固定流程", "其他"] },
      { id: "q12", prompt: "如果团队使用 AI Agent，它会参与哪些项目工作？", kind: "multiple", optional: true, options: ["整理需求", "会议纪要", "拆分任务 / 排期", "资料调研", "生成或整理素材", "其他", "目前没有 Agent"] },
      { id: "q13", prompt: "你会用 AI Agent 处理哪些非设计工作？", kind: "multiple", options: ["撰写 / 润色文字", "总结信息", "整理会议记录", "翻译", "数据整理", "任务规划", "准备跨部门沟通内容", "其他", "暂时不会"] },
      { id: "q14", prompt: "你会借助 AI Agent 与其他部门交流对接吗？", kind: "single", options: ["经常使用", "偶尔使用", "试过但没有持续", "没有使用", "工作中不需要"] },
    ] as SurveyQuestion[],
  },
  {
    id: "collaboration",
    title: "日常跨部门协作",
    eyebrow: "PART 03 · COLLABORATION",
    description: "跨部门合作时，哪些环节最需要彼此配合？",
    questions: [
      { id: "q15", prompt: "你最常对接哪些部门或角色？（最多选 4 项）", kind: "multiple", max: 4, options: ["运营", "市场", "产品", "研发 / 技术", "设计负责人", "客户", "供应商 / 印厂", "没有固定对接对象"] },
      { id: "q16", prompt: "哪个阶段最花时间？", kind: "single", options: ["接收需求", "讨论方向", "制作初稿", "内部评审", "跨部门对齐", "修改", "交付"] },
      { id: "q17", prompt: "协作中常见的困难有哪些？（最多选 3 项）", kind: "multiple", max: 3, options: ["需求不清晰", "质量标准不同", "决策人较多", "时间不足", "技术上难以实现", "找不到合适对接人", "沟通记录不完整"] },
      { id: "q18", prompt: "项目设计方向通常由谁最终决定？", kind: "single", options: ["我自己", "设计负责人", "提出需求的同事", "多方共同决定", "没有固定规则"] },
    ] as SurveyQuestion[],
  },
  {
    id: "revision",
    title: "遇到项目打回时",
    eyebrow: "PART 04 · WHEN WORK COMES BACK",
    description: "聚焦返工场景：如何把反馈变成明确、可交付的修改方案？",
    questions: [
      { id: "q19", prompt: "项目被打回或要求调整时，组内通常如何协作？", kind: "multiple", options: ["先统一反馈意见", "拆分修改任务", "与需求方开会确认", "整理多个备选方案", "成员各自修改后合并", "没有固定方式", "其他"] },
      { id: "q20", prompt: "你们如何产出可交付的修改方案？", kind: "multiple", options: ["逐条确认反馈", "评估优先级", "整理修改说明", "制作方案对比", "内部评审", "请需求方确认", "记录修改版本", "其他"] },
      { id: "q21", prompt: "返工期间，你们通常通过什么方式与跨部门沟通？", kind: "multiple", options: ["项目群沟通", "同步会议", "文档记录", "项目管理工具", "由负责人统一协调", "直接联系相关同事", "其他"] },
      { id: "q22", prompt: "返工过程中最困难的部分是什么？", kind: "single", options: ["反馈不明确", "不同人意见冲突", "优先级难判断", "责任人不清楚", "确认实现边界", "时间紧", "确认后又有新意见", "其他"] },
    ] as SurveyQuestion[],
  },
  {
    id: "outlook",
    title: "能力与下一步",
    eyebrow: "PART 05 · WHAT'S NEXT",
    description: "最后聊聊 AI 时代的能力变化与真实经历。",
    questions: [
      { id: "q23", prompt: "你认为视觉设计师最需要补足哪些能力？（最多选 3 项）", kind: "multiple", max: 3, options: ["版式 / 构图", "色彩能力", "审美判断", "需求转译", "提示词与规则", "工作流搭建", "质量把控", "跨部门沟通"] },
      { id: "q24", prompt: "哪些能力因为 AI 普及而变得不那么常用？", kind: "multiple", optional: true, options: ["版式 / 构图", "色彩能力", "审美判断", "需求转译", "提示词与规则", "工作流搭建", "质量把控", "跨部门沟通", "没有明显减少"] },
      { id: "q25", prompt: "AI 普及后，你觉得自己的工作重心如何变化？", kind: "single", options: ["执行制作减少", "判断与质量把控增加", "沟通协调增加", "工作流搭建增加", "没有明显变化"] },
      { id: "q26", prompt: "可以分享一次跨部门协作或 AI 使用的真实经历吗？（请勿写姓名、公司或客户名称）", kind: "text", optional: true, placeholder: "项目背景、遇到的卡点，以及最后如何解决……" },
    ] as SurveyQuestion[],
  },
] as const;

export type SurveySection = (typeof surveySections)[number];
export type SurveyAnswers = Record<string, string | string[] | Record<string, string | string[]>>;
export const surveyQuestionCount = surveySections.reduce((sum, section) => sum + section.questions.length, 0);

export function validateSurveyPayload(value: unknown): value is { answers: SurveyAnswers; honeypot?: string } {
  if (!value || typeof value !== "object") return false;
  const payload = value as { answers?: unknown; honeypot?: unknown };
  if (!payload.answers || typeof payload.answers !== "object" || Array.isArray(payload.answers)) return false;
  if (payload.honeypot !== undefined && typeof payload.honeypot !== "string") return false;
  const answers = payload.answers as Record<string, unknown>;
  const knownIds = new Set(surveySections.flatMap((section) => section.questions.map((question) => question.id)));
  if (Object.keys(answers).some((id) => !knownIds.has(id))) return false;
  for (const section of surveySections) {
    for (const question of section.questions) {
      const answer = answers[question.id];
      if (question.optional && (answer === undefined || answer === "" || (Array.isArray(answer) && answer.length === 0))) continue;
      if (question.kind === "text") {
        if (typeof answer !== "string" || answer.length > 3000) return false;
      } else if (question.kind === "matrix") {
        if (!answer || typeof answer !== "object" || Array.isArray(answer)) return false;
        const matrix = answer as Record<string, unknown>;
        if (Object.keys(matrix).length !== question.rows?.length || question.rows?.some((row) => !(row in matrix))) return false;
        for (const row of question.rows ?? []) {
          const cell = matrix[row];
          if (question.perRowMultiple) {
            if (!Array.isArray(cell) || cell.length === 0 || cell.length > (question.perRowMax ?? question.options?.length ?? 1) || cell.some((item) => typeof item !== "string" || !question.options?.includes(item))) return false;
          } else if (typeof cell !== "string" || !question.options?.includes(cell)) return false;
        }
      } else if (question.kind === "single") {
        if (typeof answer !== "string" || !question.options?.includes(answer)) return false;
      } else {
        if (!Array.isArray(answer) || answer.length === 0 || answer.some((item) => typeof item !== "string" || !question.options?.includes(item))) return false;
        if (question.max && answer.length > question.max) return false;
      }
    }
  }
  return true;
}
