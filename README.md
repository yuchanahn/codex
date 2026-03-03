# Codex Novel Workspace

코덱스가 소설을 작성하고, 너가 피드백하기 위해 보는 **내부 리뷰 전용** 작업 페이지입니다.

## 핵심 목적
- 작품별 진행률, 요약, 다음 집필 목표를 빠르게 확인
- 플롯 단계(도입/전개/절정/결말) 진행 상태를 가시화
- 복선/인물/사건 간 관계 그래프를 시각적으로 검토

## 현재 구조
- `index.html`: 내부 대시보드 레이아웃(작품 선택 + 진행/플롯/복선 패널)
- `styles.css`: 반응형 UI 스타일
- `app.js`: 작품 선택, 진행률 렌더링, 플롯 목록, SVG 복선 그래프 렌더링
- `data/novels.json`: 작품 데이터 + 분석 메타데이터
- `.github/workflows/deploy-pages.yml`: GitHub Pages 배포 워크플로우
# Codex Novel Studio

코덱스가 직접 소설을 작성/관리하고 GitHub Pages로 공개하기 위한 정적 웹사이트입니다.

## 목표
- 한국어 소설을 빠르게 공개하고 아카이브하기
- 레이아웃 변경에도 콘텐츠 구조(JSON)를 재사용하기
- 무료/저비용 백엔드로 점진적으로 확장하기

## 현재 구조
- `index.html`: 랜딩 + 작품 목록 + 운영 구조 안내
- `styles.css`: 전체 스타일
- `app.js`: `data/novels.json`을 읽어 카드 렌더링
- `data/novels.json`: 작품 메타데이터 저장
- `.github/workflows/deploy-pages.yml`: GitHub Pages 자동 배포

## 로컬 실행
```bash
python3 -m http.server 8000
```
브라우저에서 `http://localhost:8000` 접속.

## 비공개 운영을 위한 백엔드 전략 (추천)
이 페이지는 외부 공개가 목적이 아니므로, 아래 구조를 추천합니다.

1. **데이터 저장소: Supabase (무료 티어)**
   - 테이블: `novels`, `plot_steps`, `foreshadow_nodes`, `foreshadow_edges`, `feedback_notes`
   - Row Level Security(RLS)로 본인 계정만 읽기/쓰기 허용
2. **API/자동화: Cloudflare Workers 또는 Supabase Edge Functions**
   - 신규 화 업로드 시 요약 자동 생성
   - 플롯 상태 변경 시 그래프 데이터 재계산
3. **접근 제어: 비공개 레이어 필수**
   - GitHub Pages 그대로 쓰면 공개 URL이 노출됨
   - 내부용이면 Cloudflare Access(이메일 OTP) 또는 사설 VPN/Tailscale 앞단 권장

## 데이터 스키마 예시
각 작품은 아래 필드를 포함합니다.

```json
{
  "id": "prompt-night",
  "title": "작품명",
  "completionRate": 33,
  "plotSteps": [{ "stage": "도입", "label": "사건", "state": "done" }],
  "foreshadow": {
    "nodes": [{ "id": "n1", "label": "인물", "x": 110, "y": 130 }],
    "edges": [{ "from": "n1", "to": "n2", "hint": "복선", "resolved": false }]
  }
}
```
## 배포 주소
- 프로젝트 Pages 기본 주소: `https://yuchanahn.github.io/codex/`
- 사용자 계정/저장소 이름이 다르면 주소는 `https://<username>.github.io/<repo>/` 형식입니다.

## 배포 실패 시 확인
`Setup Pages` 단계에서 `Get Pages site failed (404)`가 나오면, 아래를 확인하세요.
1. Repository Settings → Pages에서 Source를 **GitHub Actions**로 저장
2. 워크플로우의 `actions/configure-pages`에 `enablement: true`가 있는지 확인
3. Actions 탭에서 실패한 실행을 `Re-run jobs`

## 콘텐츠 추가 방법
`data/novels.json`에 새 객체를 추가하면 자동으로 카드에 반영됩니다.

```json
{
  "title": "작품 제목",
  "status": "연재 중",
  "updatedAt": "YYYY-MM-DD",
  "summary": "작품 소개",
  "tags": ["장르", "태그"]
}
```

## 백엔드 연결 확장안(무료 중심)
1. **Supabase**
   - 독자 댓글/좋아요/구독 테이블 연결
   - Edge Functions로 간단 API 구성
2. **Cloudflare Workers**
   - 서버리스 API, 웹훅, 자동 발행 파이프라인
3. **GitHub Actions 자동화**
   - 소설 초안(JSON/Markdown) 검증 후 자동 배포

이렇게 구성하면 정적 배포의 속도를 유지하면서도 필요한 순간에 서버 기능을 단계적으로 붙일 수 있습니다.
