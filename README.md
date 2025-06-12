
# 🌿 MEMOLEAF

**부담없이 사용할 수 있는 SNS형 메모 플랫폼**

SNS의 사회적 기능과 개인 메모 플랫폼의 기능을 자연스럽게 결합한 서비스입니다.

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)](https://memoleaf.vercel.app/)
[![Demo](https://img.shields.io/badge/Demo-YouTube-FF0000?logo=youtube)](https://youtu.be/ZBteXQnmNUg?si=RCZmiC9Kf-_vcOie)

## 🚀 Live Demo

🔗 **배포 URL**: https://memoleaf.vercel.app/  
📹 **시연 영상**: https://youtu.be/ZBteXQnmNUg?si=RCZmiC9Kf-_vcOie

## ✨ 주요 기능

### 📝 메모 작성
- **다양한 글쓰기 옵션**: 비밀글, 접힌글, 부연설명 추가 기능
- **이미지 업로드**: 최대 4개까지 이미지 첨부 가능 (ALT 텍스트 지원)
- **스레드 기능**: 기존 메모에 이어지는 연속 메모 작성

### 👥 소셜 기능
- **소셜 로그인**: 구글, 카카오, 네이버 계정 연동
- **팔로우 시스템**: 사용자 간 팔로우/언팔로우
- **댓글 & 북마크**: 메모에 댓글 작성 및 북마크 저장
- **검색**: 게시글 및 사용자 검색

### 🛠️ 편의 기능
- **무한 스크롤**: 커서 기반 페이지네이션으로 끊김없는 탐색
- **반응형 디자인**: 모바일 및 데스크톱 최적화
- **웹 접근성**: 스크린 리더 지원 (NVDA 테스트 완료)

## 🛠️ 기술 스택

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![MUI](https://img.shields.io/badge/MUI-007FFF?logo=mui&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?logo=redux&logoColor=white)

### Backend & Database
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-000000?logo=next.js&logoColor=white)

### Cloud & Deploy
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white)

## 🏗️ 프로젝트 구조

```
prisma/                # 데이터베이스 스키마
src/
├── app/                   # App Router 페이지
├── components/            # 재사용 가능한 컴포넌트
├── lib/                   # 라이브러리 설정
├── store/                 # Redux 상태 관리
├── shared/                # 유틸리티 및 TypeScript 타입 정의
└── styles/                # Mui 테마 커스텀
```

## 🔧 주요 기술적 도전

### 1. Next.js App Router 도입
- 서버 컴포넌트와 클라이언트 컴포넌트 분리 설계
- 서버리스 환경에서의 성능 최적화

### 2. TypeScript 엄격 모드
- `any` 타입 금지로 코드 안정성 향상
- 타입 안전성을 통한 런타임 에러 방지

### 3. 성능 최적화
- **커서 기반 페이지네이션**: 데이터 중복 방지
- **낙관적 업데이트**: 사용자 경험 개선
- **커넥션 풀 최적화**: 서버리스 환경 대응

### 4. 웹 접근성
- NVDA 스크린 리더를 통한 접근성 테스트
- `aria-label`, `aria-live` 속성 적용
- 키보드 내비게이션 최적화

## 📊 데이터베이스 설계

### 핵심 테이블
- **User**: 사용자 정보 및 프로필
- **Memo**: 메모 콘텐츠 및 메타데이터
- **Deco**: 메모 옵션 (비밀글, 접힌글, 부연설명)
- **Image**: 이미지 파일 정보
- **Follow**: 팔로우 관계

📋 **ERD**: https://www.erdcloud.com/d/5WrwnTEr7xiD7rAPY

## 🎨 디자인

🎨 **Figma**: https://www.figma.com/design/GDTykGZiEwqElJP6HfBVIo/MEMOLEAF

## 📈 개발 기간 및 진행사항

**2025.04.28 - 2025.06.02** (약 5주)

- **4월**: 기본 기능 구현 (로그인, 메모 작성, 이미지 업로드)
- **5월**: 소셜 기능 및 최적화 (댓글, 북마크, 검색, 무한스크롤)  
- **6월**: 배포 및 성능 개선 (DB 마이그레이션, 커넥션 풀 최적화)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- 소셜 로그인 API 키 (Google, Kakao, Naver)
- Cloudinary 계정

### Installation

```bash
# 저장소 클론
git clone https://github.com/your-username/memoleaf.git
cd memoleaf

# 패키지 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일에 필요한 환경변수 입력

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 개발 서버 실행
npm run dev
```

### Environment Variables

```env
DATABASE_URL=your_postgresql_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# 소셜 로그인
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret

# 이미지 업로드
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 📝 API 문서

### 주요 엔드포인트

```
GET    /api/memos              # 메모 목록 조회
POST   /api/memos              # 메모 작성
PATCH  /api/memos              # 메모 수정
DELETE /api/memos              # 메모 삭제

POST   /api/upload             # 이미지 업로드
GET    /api/search/user        # 사용자 검색
POST   /api/users              # 팔로우
DELETE /api/users              # 언팔로우
```

## ✉ email
ho_rog@naver.com

---
