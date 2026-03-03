const year = document.querySelector('#year');
const novelList = document.querySelector('#novel-list');
const overviewContent = document.querySelector('#overview-content');
const plotList = document.querySelector('#plot-list');
const blueprintGrid = document.querySelector('#blueprint-grid');
const draftContent = document.querySelector('#draft-content');
const graph = document.querySelector('#foreshadow-graph');
const legend = document.querySelector('#foreshadow-legend');

year.textContent = String(new Date().getFullYear());

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const stateLabel = {
  done: '완료',
  active: '진행 중',
  pending: '대기'
};

const stateColor = {
  done: '#62d39f',
  active: '#7f9bff',
  pending: '#ffd166'
};

const edgeColor = (resolved) => (resolved ? '#62d39f' : '#ff7a96');

const normalizeNovel = (novel) => {
  const safe = novel && typeof novel === 'object' ? novel : {};

  return {
    id: safe.id ? String(safe.id) : `novel-${Math.random()}`,
    title: safe.title ? String(safe.title) : '제목 미정',
    status: safe.status ? String(safe.status) : '상태 미정',
    updatedAt: safe.updatedAt ? String(safe.updatedAt) : '날짜 미정',
    summary: safe.summary ? String(safe.summary) : '요약 없음',
    genre: safe.genre ? String(safe.genre) : '장르 미정',
    chapterCurrent: Number.isFinite(Number(safe.chapterCurrent)) ? Number(safe.chapterCurrent) : 0,
    chapterTarget: Number.isFinite(Number(safe.chapterTarget)) ? Number(safe.chapterTarget) : 0,
    completionRate: Number.isFinite(Number(safe.completionRate)) ? Number(safe.completionRate) : 0,
    nextGoal: safe.nextGoal ? String(safe.nextGoal) : '다음 목표 미등록',
    plotSteps: Array.isArray(safe.plotSteps) ? safe.plotSteps : [],
    plotBlueprint: Array.isArray(safe.plotBlueprint) ? safe.plotBlueprint : [],
    draftExcerpt: safe.draftExcerpt ? String(safe.draftExcerpt) : '초안 없음',
    foreshadow: safe.foreshadow && typeof safe.foreshadow === 'object' ? safe.foreshadow : { nodes: [], edges: [] }
  };
};

const renderOverview = (novel) => {
  const safeRate = Math.max(0, Math.min(100, novel.completionRate));

  overviewContent.innerHTML = `
    <h3>${escapeHtml(novel.title)}</h3>
    <p class="muted">${escapeHtml(novel.summary)}</p>
    <div class="meta-grid">
      <div class="meta-card"><strong>장르</strong><br/>${escapeHtml(novel.genre)}</div>
      <div class="meta-card"><strong>상태</strong><br/>${escapeHtml(novel.status)}</div>
      <div class="meta-card"><strong>업데이트</strong><br/>${escapeHtml(novel.updatedAt)}</div>
      <div class="meta-card"><strong>분량</strong><br/>${novel.chapterCurrent} / ${novel.chapterTarget} 화</div>
    </div>
    <div class="progress-wrap">
      <p><strong>진행률:</strong> ${safeRate}%</p>
      <div class="progress-bar"><span style="width:${safeRate}%"></span></div>
    </div>
    <p><strong>다음 목표:</strong> ${escapeHtml(novel.nextGoal)}</p>
  `;
};

const renderPlot = (novel) => {
  const items = novel.plotSteps.map((step) => {
    const safeStep = step && typeof step === 'object' ? step : {};
    const stage = safeStep.stage ? String(safeStep.stage) : '단계';
    const label = safeStep.label ? String(safeStep.label) : '내용 미정';
    const state = safeStep.state && stateLabel[safeStep.state] ? safeStep.state : 'pending';

    return `
      <li class="plot-item" style="border-color:${stateColor[state]}">
        <strong>${escapeHtml(stage)}</strong> · ${escapeHtml(label)}<br/>
        <small>${stateLabel[state]}</small>
      </li>
    `;
  });

  plotList.innerHTML = items.length > 0 ? items.join('') : '<li>플롯 데이터 없음</li>';
};

const renderBlueprint = (novel) => {
  const items = novel.plotBlueprint.map((item) => {
    const safeItem = item && typeof item === 'object' ? item : {};
    const title = safeItem.title ? String(safeItem.title) : '단계';
    const detail = safeItem.detail ? String(safeItem.detail) : '설명 없음';

    return `<article class="blueprint-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(detail)}</p></article>`;
  });

  blueprintGrid.innerHTML = items.length > 0 ? items.join('') : '<p>설계도 데이터 없음</p>';
};

const renderDraft = (novel) => {
  draftContent.textContent = novel.draftExcerpt;
};

const drawForeshadowGraph = (novel) => {
  const nodes = Array.isArray(novel.foreshadow.nodes) ? novel.foreshadow.nodes : [];
  const edges = Array.isArray(novel.foreshadow.edges) ? novel.foreshadow.edges : [];
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  const edgeMarkup = edges
    .map((edge) => {
      const from = nodeMap.get(edge.from);
      const to = nodeMap.get(edge.to);
      if (!from || !to) return '';

      const color = edgeColor(Boolean(edge.resolved));
      return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="${color}" stroke-width="3" stroke-linecap="round" />`;
    })
    .join('');

  const nodeMarkup = nodes
    .map((node) => {
      const safeLabel = escapeHtml(node.label ?? '노드');
      return `
        <g>
          <circle cx="${node.x}" cy="${node.y}" r="18" fill="#7f9bff" />
          <text x="${node.x}" y="${node.y - 28}" text-anchor="middle" fill="#ebf0ff" font-size="13">${safeLabel}</text>
        </g>
      `;
    })
    .join('');

  graph.innerHTML = `${edgeMarkup}${nodeMarkup}`;

  const legendItems = edges.map((edge) => {
    const from = nodeMap.get(edge.from)?.label ?? edge.from;
    const to = nodeMap.get(edge.to)?.label ?? edge.to;
    const status = edge.resolved ? '해결' : '미해결';
    return `<li>${escapeHtml(from)} → ${escapeHtml(to)} : ${escapeHtml(edge.hint ?? '단서')} (${status})</li>`;
  });

  legend.innerHTML = legendItems.length > 0 ? legendItems.join('') : '<li>복선 데이터 없음</li>';
};

const renderNovelButtons = (novels, activeId, onClick) => {
  novelList.innerHTML = novels
    .map((novel) => {
      const activeClass = novel.id === activeId ? 'novel-button novel-button--active' : 'novel-button';
      return `<button type="button" class="${activeClass}" data-id="${escapeHtml(novel.id)}">${escapeHtml(
        novel.title
      )}</button>`;
    })
    .join('');

  novelList.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => onClick(button.dataset.id));
  });
};

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch (error) {
      console.error('Service Worker 등록 실패', error);
    }
  }
};

const boot = async () => {
  const response = await fetch('./data/novels.json');
  if (!response.ok) {
    throw new Error('novel data를 불러오지 못했습니다.');
  }

  const payload = await response.json();
  const novels = Array.isArray(payload) ? payload.map(normalizeNovel) : [];

  if (novels.length === 0) {
    overviewContent.innerHTML = '<p>등록된 작품이 없습니다.</p>';
    return;
  }

  let activeId = novels[0].id;

  const render = () => {
    const current = novels.find((novel) => novel.id === activeId) ?? novels[0];
    activeId = current.id;

    renderNovelButtons(novels, activeId, (id) => {
      activeId = id;
      render();
    });

    renderOverview(current);
    renderPlot(current);
    renderBlueprint(current);
    renderDraft(current);
    drawForeshadowGraph(current);
  };

  render();
  await registerServiceWorker();
};

boot().catch((error) => {
  overviewContent.innerHTML =
    '<p>데이터를 불러오는 중 오류가 발생했습니다. data/novels.json 형식을 확인해주세요.</p>';
  plotList.innerHTML = '<li>오류로 인해 플롯을 표시할 수 없습니다.</li>';
  blueprintGrid.innerHTML = '<p>오류로 인해 설계도를 표시할 수 없습니다.</p>';
  draftContent.textContent = '오류로 인해 초안을 표시할 수 없습니다.';
  legend.innerHTML = '<li>오류로 인해 복선 그래프를 표시할 수 없습니다.</li>';
  graph.innerHTML = '';
  console.error(error);
});
