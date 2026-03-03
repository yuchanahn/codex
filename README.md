# Codex Novel Workspace

코덱스가 소설을 작성하고, 너가 피드백하기 위해 보는 **내부 리뷰 전용** 작업 페이지입니다.

## 이번 업데이트
- PWA 지원 추가: `manifest.webmanifest`, `sw.js`, 앱 아이콘 추가
- 오프라인 캐시: 핵심 정적 파일/데이터 캐싱
- 소설 집필 시작: 신규 작품 `아카이브의 설계자` 추가 (플롯 설계도 + 1화 초안)
- 대시보드 확장: `플롯 설계도`, `현재 집필 초안` 패널 추가

## 핵심 목적
- 작품별 진행률, 요약, 다음 집필 목표를 빠르게 확인
- 플롯 단계(도입/전개/절정/결말) 진행 상태를 가시화
- 복선/인물/사건 간 관계 그래프를 시각적으로 검토
- 초안 텍스트와 설계도를 함께 보며 즉시 피드백 반영

## 현재 구조
- `index.html`: 내부 대시보드 레이아웃(작품 선택 + 진행/플롯/설계/초안/복선 패널)
- `styles.css`: 반응형 UI 스타일
- `app.js`: 작품 선택, 진행률 렌더링, 플롯/설계/초안 렌더링, SVG 복선 그래프 렌더링, Service Worker 등록
- `data/novels.json`: 작품 데이터 + 분석 메타데이터
- `manifest.webmanifest`: PWA 메타데이터
- `sw.js`: 오프라인 캐시 Service Worker
- `icons/`: PWA 아이콘

## 로컬 실행
```bash
python3 -m http.server 8000
```
브라우저에서 `http://localhost:8000` 접속.

## 자동 업데이트 모드
- 목표: **네가 따로 버튼/머지 작업을 안 해도**, 코덱스가 커밋/푸시한 최신 상태가 바로 Pages에 반영되게 운영
- 현재 워크플로우는 모든 브랜치 push(`branches: ['**']`)에서 배포를 실행
- 즉, 코덱스가 작업 완료 후 푸시만 되면 Pages가 자동 갱신됨
- 충돌 PR을 수동으로 열어 머지하지 않아도, 최신 푸시 브랜치 기준으로 사이트가 갱신됨

## 비공개 운영을 위한 백엔드 전략 (추천)
이 페이지는 외부 공개가 목적이 아니므로, 아래 구조를 추천합니다.

1. **데이터 저장소: Supabase (무료 티어)**
   - 테이블: `novels`, `plot_steps`, `foreshadow_nodes`, `foreshadow_edges`, `feedback_notes`, `draft_versions`
   - Row Level Security(RLS)로 본인 계정만 읽기/쓰기 허용
2. **API/자동화: Cloudflare Workers 또는 Supabase Edge Functions**
   - 신규 화 업로드 시 요약 자동 생성
   - 플롯 상태 변경 시 그래프 데이터 재계산
3. **접근 제어: 비공개 레이어 필수**
   - GitHub Pages 그대로 쓰면 공개 URL이 노출됨
   - 내부용이면 Cloudflare Access(이메일 OTP) 또는 사설 VPN/Tailscale 앞단 권장

## 데이터 스키마 예시
```json
{
  "id": "archive-mastermind",
  "title": "작품명",
  "completionRate": 5,
  "plotSteps": [{ "stage": "도입", "label": "사건", "state": "active" }],
  "plotBlueprint": [{ "title": "핵심 갈등", "detail": "설명" }],
  "draftExcerpt": "1화 초안 텍스트",
  "foreshadow": {
    "nodes": [{ "id": "n1", "label": "인물", "x": 110, "y": 130 }],
    "edges": [{ "from": "n1", "to": "n2", "hint": "복선", "resolved": false }]
  }
}
```
