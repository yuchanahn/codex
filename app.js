const novelGrid = document.querySelector('#novel-grid');
const year = document.querySelector('#year');

year.textContent = String(new Date().getFullYear());

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
