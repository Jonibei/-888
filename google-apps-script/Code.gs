const SPREADSHEET_ID = '1HNU0oSaxioA_FYmHC4lR29ff7twFrDEbgoWr8Sbh0V0';
const ANSWER_HEADERS = Array.from({ length: 26 }, (_, index) => `Q${index + 1}`);
const HEADER = ['提交时间', ...ANSWER_HEADERS];
const MULTI_QUESTION_IDS = new Set(['q6','q11','q12','q13','q15','q17','q19','q20','q21','q23','q24']);
const PROJECT_STAGES = ['需求接收','方向讨论','首稿制作','组内评审','跨部门对齐','修改迭代','交付上线'];
const MATRIX_QUESTIONS = new Set(['q8','q9','q10']);
const QUESTION_OPTIONS = {
  q1:['品牌 / 平面设计','UI / 界面设计','电商 / 营销设计','动效 / 视频设计','其他'],
  q2:['20 人以下','20–99 人','100–499 人','500–2000 人','2000 人以上','不清楚'],
  q3:['不到 1 年','1–3 年','3–5 年','5–8 年','8 年以上'],
  q4:['执行设计师','独立负责项目','设计负责人 / 管理者','其他'],
  q5:['基本不使用','偶尔生成素材','日常生成并编辑','已融入设计工作流','会配置或编排 AI Agent'],
  q6:['互联网 / 科技','消费 / 零售','教育','金融','医疗健康','旅游 / 文旅','制造业','公共服务','其他'],
  q7:['已投入使用','正在试点','计划搭建','没有','不清楚'],
  q8:['我自己','设计组成员','设计负责人','其他部门','外部供应商','客户 / 需求方','AI Agent','共同负责','其他'],
  q9:['没有使用','不到 25%','25%–50%','51%–75%','超过 75%','不确定'],
  q10:['运营','市场','产品 / 项目经理','研发 / 技术','设计负责人','客户','供应商 / 印厂','没有固定对接对象'],
  q11:['我自己','设计组成员','设计负责人','其他部门','外部供应商','客户 / 需求方','AI Agent','共同负责'],
  q12:['整理需求','会议纪要','拆分任务 / 排期','资料调研','生成或整理素材','其他','目前没有 Agent'],
  q13:['撰写 / 润色文字','总结信息','整理会议记录','翻译','数据整理','任务规划','准备跨部门沟通内容','其他','暂时不会'],
  q14:['经常使用','偶尔使用','试过但没有持续','没有使用','工作中不需要'],
  q15:['运营','市场','产品','研发 / 技术','设计负责人','客户','供应商 / 印厂','没有固定对接对象'],
  q16:['接收需求','讨论方向','制作初稿','内部评审','跨部门对齐','修改','交付'],
  q17:['需求不清晰','质量标准不同','决策人较多','时间不足','技术上难以实现','找不到合适对接人','沟通记录不完整'],
  q18:['我自己','设计负责人','提出需求的同事','多方共同决定','没有固定规则'],
  q19:['先统一反馈意见','拆分修改任务','与需求方开会确认','整理多个备选方案','成员各自修改后合并','没有固定方式','其他'],
  q20:['逐条确认反馈','评估优先级','整理修改说明','制作方案对比','内部评审','请需求方确认','记录修改版本','其他'],
  q21:['项目群沟通','同步会议','文档记录','项目管理工具','由负责人统一协调','直接联系相关同事','其他'],
  q22:['反馈不明确','不同人意见冲突','优先级难判断','责任人不清楚','确认实现边界','时间紧','确认后又有新意见','其他'],
  q23:['版式 / 构图','色彩能力','审美判断','需求转译','提示词与规则','工作流搭建','质量把控','跨部门沟通'],
  q24:['版式 / 构图','色彩能力','审美判断','需求转译','提示词与规则','工作流搭建','质量把控','跨部门沟通','没有明显减少'],
  q25:['执行制作减少','判断与质量把控增加','沟通协调增加','工作流搭建增加','没有明显变化']
};

function output(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function authorized(body) {
  const expected = PropertiesService.getScriptProperties().getProperty('SURVEY_SHARED_TOKEN');
  return Boolean(expected && body.token && body.token === expected);
}

function doPost(event) {
  const started = Date.now();
  let action = 'unknown';
  try {
    const body = JSON.parse(event.postData.contents || '{}');
    action = body.action || 'unknown';
    if (!authorized(body)) throw new Error('unauthorized');
    if (action === 'submit') return appendResponse(body.answers, started);
    if (action === 'analysis') return output(buildAnalysis());
    throw new Error('unsupported_action');
  } catch (error) {
    console.error('[survey-apps-script] fail', JSON.stringify({ action, reason: String(error.message || error), ms: Date.now() - started }));
    return output({ ok: false, error: 'request_failed' });
  }
}

function appendResponse(answers, started) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('回答数据');
  if (!sheet) throw new Error('response_sheet_missing');
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADER);
  sheet.getRange('I:K').setWrap(true);
  sheet.setColumnWidths(9, 3, 300);
  if (!answers || typeof answers !== 'object') throw new Error('answers_missing');
  const row = [new Date()];
  ANSWER_HEADERS.forEach((header, index) => {
    const id = `q${index + 1}`;
    const value = answers[id];
    if (MATRIX_QUESTIONS.has(id)) {
      if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== PROJECT_STAGES.length) throw new Error(`invalid_${id}`);
      const options = QUESTION_OPTIONS[id];
      const encoded = PROJECT_STAGES.map(stage => {
        const cell = value[stage];
        if (id === 'q8' || id === 'q10') {
          if (!Array.isArray(cell) || cell.length === 0 || cell.length > 4 || cell.some(item => !options.includes(item))) throw new Error(`invalid_${id}`);
          return `${stage}: ${cell.join('、')}`;
        }
        if (typeof cell !== 'string' || !options.includes(cell)) throw new Error(`invalid_${id}`);
        return `${stage}: ${cell}`;
      });
      row.push(encoded.join(' | '));
    } else if (Array.isArray(value)) {
      if (!MULTI_QUESTION_IDS.has(id) || value.some(item => !QUESTION_OPTIONS[id]?.includes(item))) throw new Error(`invalid_${id}`);
      row.push(value.join(' | '));
    } else if (typeof value === 'string') {
      if (value.length > 3000 || (QUESTION_OPTIONS[id] && !QUESTION_OPTIONS[id].includes(value))) throw new Error(`invalid_${id}`);
      row.push(value);
    } else {
      row.push('');
    }
  });
  sheet.appendRow(row);
  sheet.autoResizeRows(sheet.getLastRow(), 1);
  console.info('[survey-apps-script] success', JSON.stringify({ action:'submit', answered: row.filter((value, index) => index > 0 && value).length, ms: Date.now() - started }));
  return output({ ok: true });
}

function buildAnalysis() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('回答数据');
  if (!sheet || sheet.getLastRow() < 2) return { ok: true, total: 0, items: {} };
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADER.length).getDisplayValues();
  const items = {};
  for (let questionNumber = 1; questionNumber <= 25; questionNumber += 1) {
    const id = `q${questionNumber}`;
    const options = QUESTION_OPTIONS[id];
    if (!options) continue;
    const result = {};
    options.forEach(choice => result[choice] = 0);
    rows.forEach(row => {
      const raw = row[questionNumber];
      if (!raw) return;
      let values;
      if (MATRIX_QUESTIONS.has(id)) {
        values = raw.split(' | ').flatMap(cell => {
          const separator = cell.indexOf(': ');
          if (separator < 0) return [];
          const answer = cell.slice(separator + 2);
          return id === 'q9' ? [answer] : answer.split('、');
        });
      } else if (MULTI_QUESTION_IDS.has(id)) {
        values = raw.split(' | ');
      } else {
        values = [raw];
      }
      values.forEach(value => { if (Object.hasOwn(result, value)) result[value] += 1; });
    });
    items[id] = result;
  }
  return {
    ok: true,
    total: rows.filter(row => row[0]).length,
    items
  };
}
