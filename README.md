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
