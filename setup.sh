#!/bin/bash

# 종합 ERP 관리 시스템 - 시놀로지 NAS 설치 스크립트
# 사용법: sudo bash setup.sh

set -e

echo "=== 종합 ERP 관리 시스템 설치 시작 ==="

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 시놀로지 확인
if ! grep -q "synology" /etc/synoinfo.conf 2>/dev/null; then
    log_warn "시놀로지 NAS가 아닌 시스템에서 실행 중입니다."
fi

# Docker 확인
if ! command -v docker &> /dev/null; then
    log_error "Docker가 설치되어 있지 않습니다. 시놀로지 패키지 센터에서 Docker를 설치해주세요."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose가 설치되어 있지 않습니다."
    exit 1
fi

log_info "Docker 설치 확인됨"

# 프로젝트 디렉토리 생성
PROJECT_DIR="/volume1/docker/inventory-system"
log_info "프로젝트 디렉토리 생성: $PROJECT_DIR"

mkdir -p $PROJECT_DIR/{server/src,client/src,uploads,data,logs}
cd $PROJECT_DIR

# 환경변수 파일 생성
log_info "환경변수 파일 생성 중..."

cat > .env << 'EOF'
# 서버 설정
PORT=3001
NODE_ENV=production

# 보안 설정 (프로덕션에서는 반드시 변경하세요!)
SESSION_SECRET=your_session_secret_here_please_change_this_in_production
JWT_SECRET=your_jwt_secret_here_please_change_this_in_production

# 파일 업로드 설정
MAX_FILE_SIZE=50MB
UPLOAD_PATH=./uploads

# 로그 레벨
LOG_LEVEL=info

# 클라이언트 URL
CLIENT_URL=http://localhost:3000
VITE_API_URL=http://localhost:3001/api
EOF

# 필요한 디렉토리 권한 설정
log_info "디렉토리 권한 설정 중..."
chmod 755 $PROJECT_DIR
chmod 777 $PROJECT_DIR/{uploads,data,logs}

# Docker Compose 파일 검증
if [ ! -f "docker-compose.yml" ]; then
    log_error "docker-compose.yml 파일이 없습니다. 프로젝트 파일을 올바르게 업로드했는지 확인해주세요."
    exit 1
fi

# 기존 컨테이너 정리
log_info "기존 컨테이너 정리 중..."
docker-compose down --remove-orphans 2>/dev/null || true

# Docker 이미지 빌드
log_info "Docker 이미지 빌드 중... (이 과정은 몇 분 소요될 수 있습니다)"
if ! docker-compose build --no-cache; then
    log_error "Docker 이미지 빌드에 실패했습니다."
    exit 1
fi

# 컨테이너 시작
log_info "컨테이너 시작 중..."
if ! docker-compose up -d; then
    log_error "컨테이너 시작에 실패했습니다."
    exit 1
fi

# 서비스 상태 확인
log_info "서비스 상태 확인 중..."
sleep 10

# 헬스체크
for i in {1..30}; do
    if curl -f http://localhost:3001/api/health &>/dev/null; then
        log_info "백엔드 서비스가 정상적으로 시작되었습니다."
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "백엔드 서비스 시작 확인에 실패했습니다."
        docker-compose logs api-server
        exit 1
    fi
    sleep 2
done

# 프론트엔드 확인
if curl -f http://localhost &>/dev/null; then
    log_info "프론트엔드 서비스가 정상적으로 시작되었습니다."
else
    log_warn "프론트엔드 서비스 확인에 실패했습니다."
fi

# 방화벽 설정 안내
log_info "방화벽 설정을 확인해주세요:"
echo "  - 포트 80 (웹 인터페이스)"
echo "  - 포트 3001 (API 서버)"

# 시놀로지 특화 설정
if grep -q "synology" /etc/synoinfo.conf 2>/dev/null; then
    log_info "시놀로지 DSM 설정 안내:"
    echo "  1. 제어판 > 보안 > 방화벽에서 포트 80, 3001 허용"
    echo "  2. 제어판 > 애플리케이션 포털 > 리버스 프록시 설정 (선택사항)"
    echo "  3. 제어판 > 작업 스케줄러로 자동 시작 설정 (선택사항)"
fi

# 완료 메시지
echo ""
echo "=== 설치 완료 ==="
log_info "웹 인터페이스: http://$(hostname -I | awk '{print $1}')"
log_info "API 서버: http://$(hostname -I | awk '{print $1}'):3001"
echo ""
log_info "관리 명령어:"
echo "  - 상태 확인: docker-compose ps"
echo "  - 로그 확인: docker-compose logs -f"
echo "  - 재시작: docker-compose restart"
echo "  - 중지: docker-compose stop"
echo "  - 업데이트: docker-compose pull && docker-compose up -d"
echo ""

# 자동 시작 스크립트 생성
cat > start.sh << 'EOF'
#!/bin/bash
cd /volume1/docker/inventory-system
docker-compose up -d
EOF

cat > stop.sh << 'EOF'
#!/bin/bash
cd /volume1/docker/inventory-system
docker-compose stop
EOF

chmod +x start.sh stop.sh

log_info "시스템 관리 스크립트가 생성되었습니다:"
echo "  - 시작: ./start.sh"
echo "  - 중지: ./stop.sh"

echo ""
echo "🎉 종합 ERP 관리 시스템이 성공적으로 설치되었습니다!"
echo ""