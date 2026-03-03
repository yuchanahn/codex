const novelGrid = document.querySelector('#novel-grid');
const year = document.querySelector('#year');

year.textContent = String(new Date().getFullYear());

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const normalizeNovel = (novel) => {
  const safeNovel = novel && typeof novel === 'object' ? novel : {};

  return {
    title: safeNovel.title ? String(safeNovel.title) : '제목 미정',
    status: safeNovel.status ? String(safeNovel.status) : '상태 미정',
    updatedAt: safeNovel.updatedAt ? String(safeNovel.updatedAt) : '날짜 미정',
    summary: safeNovel.summary ? String(safeNovel.summary) : '작품 소개가 아직 등록되지 않았습니다.',
    tags: Array.isArray(safeNovel.tags)
      ? safeNovel.tags.filter((tag) => tag !== null && tag !== undefined).map((tag) => String(tag))
      : []
  };
};

const renderNovelCard = (novel) => {
  const normalized = normalizeNovel(novel);
  const tags =
    normalized.tags.length > 0
      ? normalized.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')
      : '<span class="tag">태그 없음</span>';

  return `
    <article class="novel-card">
      <h3>${escapeHtml(normalized.title)}</h3>
      <p class="novel-card__meta">${escapeHtml(normalized.status)} · ${escapeHtml(normalized.updatedAt)}</p>
      <p>${escapeHtml(normalized.summary)}</p>
const renderNovelCard = (novel) => {
  const tags = novel.tags.map((tag) => `<span class="tag">${tag}</span>`).join('');

  return `
    <article class="novel-card">
      <h3>${novel.title}</h3>
      <p class="novel-card__meta">${novel.status} · ${novel.updatedAt}</p>
      <p>${novel.summary}</p>
      <div class="novel-card__tags">${tags}</div>
    </article>
  `;
};

const loadNovels = async () => {
  try {
    const response = await fetch('./data/novels.json');
    if (!response.ok) {
      throw new Error('novel data를 불러오지 못했습니다.');
    }

    const payload = await response.json();
    const novels = Array.isArray(payload) ? payload : [];

    if (novels.length === 0) {
      novelGrid.innerHTML = '<p>아직 등록된 작품이 없습니다.</p>';
      return;
    }

    const novels = await response.json();
    novelGrid.innerHTML = novels.map(renderNovelCard).join('');
  } catch (error) {
    novelGrid.innerHTML = `
      <p>콘텐츠를 불러오는 중 문제가 발생했습니다. 저장소의 data/novels.json 파일을 확인해주세요.</p>
    `;
    console.error(error);
  }
};

loadNovels();
