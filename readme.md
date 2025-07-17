# 물품 수령 관리 시스템

시놀로지 NAS에서 Docker를 통해 실행되는 물품 수령 관리 웹 애플리케이션입니다.

## 🎯 주요 기능

- **카카오톡 메시지 파싱**: 복사한 메시지에서 자동으로 품목 정보 추출
- **물품 수령 처리**: 간편한 웹 인터페이스로 수령 처리
- **엑셀 파일 지원**: 기존 구매리스트 엑셀 파일 업로드
- **실시간 현황**: 수령 내역 및 전체 품목 현황 확인
- **반응형 디자인**: 모바일 및 데스크톱 최적화

## 📋 시스템 요구사항

- 시놀로지 NAS (DSM 6.0 이상)
- Docker 패키지 설치
- 최소 512MB RAM
- 1GB 디스크 공간

## 🚀 시놀로지 NAS 설치 방법

### 1. SSH로 NAS 접속

```bash
ssh admin@your-nas-ip
```

### 2. 프로젝트 폴더 생성

```bash
# Docker 프로젝트 폴더 생성
mkdir -p /volume1/docker/inventory-system
cd /volume1/docker/inventory-system
```

### 3. 파일 업로드

다음 파일들을 생성하거나 업로드하세요:

```
inventory-system/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── server.js
├── .env
├── public/
│   └── index.html
├── uploads/ (자동 생성)
└── data/ (자동 생성)
```

### 4. 환경변수 설정

```bash
# .env 파일 생성
cp .env.example .env
nano .env
```

### 5. Docker 컨테이너 실행

```bash
# 이미지 빌드 및 컨테이너 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

### 6. 웹 접속

브라우저에서 `http://your-nas-ip:3000` 접속

## 📱 사용 방법

### 카카오톡 메시지 처리

1. 카카오톡에서 다음 형식의 메시지 복사:
```
[물품 수령 보고]
품목 번호 : 40번
품목명 : 경량랙 철제 선반
개수 : 2개
```

2. 웹페이지의 "카카오톡 메시지 처리" 섹션에 붙여넣기
3. "메시지 파싱" 버튼 클릭
4. 자동으로 채워진 정보 확인 후 수령자 입력
5. "수령 처리" 버튼 클릭

### 수동 수령 처리

1. 품목 번호 입력 후 "품목 조회" 클릭
2. 품목 정보 확인
3. 수령 수량, 수령자, 비고 입력
4. "수령 처리" 버튼 클릭

### 엑셀 파일 업로드

1. "파일 업로드" 탭 선택
2. 구매리스트 엑셀 파일 선택
3. "파일 업로드" 버튼 클릭

## 🔧 관리 및 운영

### 컨테이너 관리

```bash
# 컨테이너 상태 확인
docker-compose ps

# 컨테이너 중지
docker-compose stop

# 컨테이너 재시작
docker-compose restart

# 컨테이너 제거
docker-compose down
```

### 데이터 백업

```bash
# uploads 폴더 백업 (엑셀 파일)
tar -czf backup-$(date +%Y%m%d).tar.gz uploads/

# 전체 프로젝트 백업
tar -czf inventory-system-backup-$(date +%Y%m%d).tar.gz /volume1/docker/inventory-system/
```

### 로그 확인

```bash
# 실시간 로그 보기
docker-compose logs -f

# 최근 100줄 로그
docker-compose logs --tail=100
```

## 🌐 네트워크 설정

### 포트 포워딩 (외부 접속 시)

1. 시놀로지 DSM → 제어판 → 외부 접근 → 라우터 구성
2. 포트 3000을 외부 포트로 설정
3. 방화벽에서 포트 3000 허용

### HTTPS 설정 (선택사항)

```bash
# 리버스 프록시 설정으로 HTTPS 지원
# DSM → 애플리케이션 포털 → 리버스 프록시
```

## 🔒 보안 고려사항

1. **방화벽 설정**: 필요한 포트만 개방
2. **HTTPS 사용**: 프로덕션 환경에서는 HTTPS 권장
3. **정기 백업**: 데이터 정기 백업 수행
4. **접근 제한**: VPN이나 IP 제한 설정 권장

## 🛠️ 문제 해결

### 컨테이너가 시작되지 않는 경우

```bash
# 포트 충돌 확인
netstat -tlnp | grep 3000

# 로그 확인
docker-compose logs

# 이미지 재빌드
docker-compose build --no-cache
```

### 엑셀 파일 업로드 오류

1. 파일 형식 확인 (.xlsx, .xls)
2. 파일 크기 확인 (10MB 이하)
3. 엑셀 파일의 헤더 구조 확인

### 메모리 부족 시

```bash
# 컨테이너 리소스 제한 설정
# docker-compose.yml 파일에서 memory 값 조정
```

## 📞 지원

문제 발생 시 다음 정보와 함께 문의:

1. 시놀로지 모델 및 DSM 버전
2. Docker 버전
3. 오류 로그
4. 재현 단계

## 📄 라이선스

MIT License

## 🔄 업데이트

```bash
# 최신 코드 반영
git pull origin main

# 컨테이너 재빌드
docker-compose up -d --build
```