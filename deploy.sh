#!/bin/bash

# Boatable Platform Deployment Script
# Comprehensive deployment pipeline for maritime social network

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Deployment configuration
ENVIRONMENT=${1:-production}
SKIP_TESTS=${SKIP_TESTS:-false}
SKIP_BUILD=${SKIP_BUILD:-false}
NOTIFY_SLACK=${NOTIFY_SLACK:-true}

echo -e "${BLUE}⚓ Deploying Boatable Maritime Platform to ${ENVIRONMENT}...${NC}"
echo "=================================================="

# Function to log with timestamp
log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to handle errors
handle_error() {
    log "${RED}❌ Error: $1${NC}"
    exit 1
}

# Function to check prerequisites
check_prerequisites() {
    log "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check if required tools are installed
    command -v node >/dev/null 2>&1 || handle_error "Node.js is not installed"
    command -v bun >/dev/null 2>&1 || handle_error "Bun is not installed"
    command -v firebase >/dev/null 2>&1 || handle_error "Firebase CLI is not installed"
    
    # Check environment variables
    if [ "$ENVIRONMENT" = "production" ]; then
        [ -f ".env.local" ] || handle_error ".env.local file not found for production deployment"
    fi
    
    log "${GREEN}✅ Prerequisites check passed${NC}"
}

# Function to install dependencies
install_dependencies() {
    log "${BLUE}📦 Installing dependencies...${NC}"
    bun install || handle_error "Failed to install dependencies"
    log "${GREEN}✅ Dependencies installed successfully${NC}"
}

# Function to run linting
run_linting() {
    log "${BLUE}🔍 Running code linting...${NC}"
    bun run lint || handle_error "Linting failed - please fix code style issues"
    log "${GREEN}✅ Code linting passed${NC}"
}

# Function to run type checking
run_typecheck() {
    log "${BLUE}📝 Running TypeScript type checking...${NC}"
    bun run typecheck || handle_error "Type checking failed - please fix TypeScript errors"
    log "${GREEN}✅ Type checking passed${NC}"
}

# Function to run tests
run_tests() {
    if [ "$SKIP_TESTS" = "true" ]; then
        log "${YELLOW}⚠️  Skipping tests (SKIP_TESTS=true)${NC}"
        return
    fi
    
    log "${BLUE}🧪 Running test suite...${NC}"
    
    # Run unit tests
    bun run test || handle_error "Unit tests failed"
    
    # Run e2e tests if available
    if grep -q "test:e2e" package.json; then
        log "${BLUE}🌐 Running end-to-end tests...${NC}"
        bun run test:e2e || handle_error "E2E tests failed"
    fi
    
    log "${GREEN}✅ All tests passed${NC}"
}

# Function to generate test data
generate_data() {
    log "${BLUE}🗃️  Generating maritime data...${NC}"
    bun run generate-data || handle_error "Failed to generate test data"
    log "${GREEN}✅ Maritime data generated successfully${NC}"
}

# Function to build application
build_application() {
    if [ "$SKIP_BUILD" = "true" ]; then
        log "${YELLOW}⚠️  Skipping build (SKIP_BUILD=true)${NC}"
        return
    fi
    
    log "${BLUE}🏗️  Building Boatable application...${NC}"
    
    # Set build environment
    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1
    
    bun run build || handle_error "Build failed"
    
    # Check build output
    [ -d ".next" ] || handle_error "Build output directory not found"
    
    log "${GREEN}✅ Application built successfully${NC}"
}

# Function to run database migrations
run_migrations() {
    log "${BLUE}🗄️  Running database migrations...${NC}"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        log "${YELLOW}⚠️  Running production migrations - this may take a while...${NC}"
    fi
    
    bun run migrate || handle_error "Database migrations failed"
    log "${GREEN}✅ Database migrations completed${NC}"
}

# Function to deploy to Firebase
deploy_firebase() {
    log "${BLUE}🔥 Deploying to Firebase...${NC}"
    
    # Deploy Firestore rules and functions
    firebase deploy --only firestore:rules,functions --project=${ENVIRONMENT} || handle_error "Firebase deployment failed"
    
    log "${GREEN}✅ Firebase services deployed${NC}"
}

# Function to deploy to Vercel
deploy_vercel() {
    log "${BLUE}▲ Deploying to Vercel...${NC}"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        vercel --prod --yes || handle_error "Vercel production deployment failed"
    else
        vercel --yes || handle_error "Vercel staging deployment failed"
    fi
    
    log "${GREEN}✅ Vercel deployment completed${NC}"
}

# Function to invalidate CDN cache
invalidate_cache() {
    log "${BLUE}🔄 Invalidating CDN cache...${NC}"
    
    # Clear Next.js cache
    bun run clear-cache || log "${YELLOW}⚠️  Cache clear command not available${NC}"
    
    # If using Cloudflare, purge cache
    if [ -n "$CLOUDFLARE_API_TOKEN" ] && [ -n "$CLOUDFLARE_ZONE_ID" ]; then
        curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
             -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
             -H "Content-Type: application/json" \
             --data '{"purge_everything":true}' || log "${YELLOW}⚠️  Cloudflare cache purge failed${NC}"
    fi
    
    log "${GREEN}✅ Cache invalidation completed${NC}"
}

# Function to run health checks
run_health_checks() {
    log "${BLUE}🏥 Running post-deployment health checks...${NC}"
    
    # Wait for deployment to be ready
    sleep 10
    
    # Check if the application is responding
    if [ "$ENVIRONMENT" = "production" ]; then
        HEALTH_URL="https://boatable.com/api/health"
    else
        HEALTH_URL="https://boatable-staging.vercel.app/api/health"
    fi
    
    # Basic health check
    if curl -f -s "$HEALTH_URL" > /dev/null 2>&1; then
        log "${GREEN}✅ Application health check passed${NC}"
    else
        log "${YELLOW}⚠️  Health check failed - manual verification required${NC}"
    fi
}

# Function to send notifications
send_notifications() {
    if [ "$NOTIFY_SLACK" != "true" ]; then
        return
    fi
    
    log "${BLUE}📢 Sending deployment notifications...${NC}"
    
    # Get deployment info
    DEPLOY_TIME=$(date '+%Y-%m-%d %H:%M:%S UTC')
    GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    GIT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
    
    # Slack notification
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        SLACK_MESSAGE="{
            \"text\": \"⚓ Boatable Platform Deployed Successfully!\",
            \"attachments\": [{
                \"color\": \"good\",
                \"fields\": [
                    {\"title\": \"Environment\", \"value\": \"$ENVIRONMENT\", \"short\": true},
                    {\"title\": \"Branch\", \"value\": \"$GIT_BRANCH\", \"short\": true},
                    {\"title\": \"Commit\", \"value\": \"$GIT_COMMIT\", \"short\": true},
                    {\"title\": \"Deploy Time\", \"value\": \"$DEPLOY_TIME\", \"short\": true}
                ]
            }]
        }"
        
        curl -X POST "$SLACK_WEBHOOK_URL" \
             -H 'Content-Type: application/json' \
             -d "$SLACK_MESSAGE" || log "${YELLOW}⚠️  Slack notification failed${NC}"
    fi
    
    # Discord notification
    if [ -n "$DISCORD_WEBHOOK_URL" ]; then
        DISCORD_MESSAGE="{
            \"content\": \"⚓ **Boatable Platform Deployed**\",
            \"embeds\": [{
                \"color\": 5763719,
                \"fields\": [
                    {\"name\": \"Environment\", \"value\": \"$ENVIRONMENT\", \"inline\": true},
                    {\"name\": \"Branch\", \"value\": \"$GIT_BRANCH\", \"inline\": true},
                    {\"name\": \"Commit\", \"value\": \"$GIT_COMMIT\", \"inline\": true}
                ],
                \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"
            }]
        }"
        
        curl -X POST "$DISCORD_WEBHOOK_URL" \
             -H 'Content-Type: application/json' \
             -d "$DISCORD_MESSAGE" || log "${YELLOW}⚠️  Discord notification failed${NC}"
    fi
    
    log "${GREEN}✅ Notifications sent${NC}"
}

# Function to cleanup
cleanup() {
    log "${BLUE}🧹 Cleaning up temporary files...${NC}"
    
    # Remove any temporary deployment files
    rm -rf .deployment-tmp/ || true
    
    log "${GREEN}✅ Cleanup completed${NC}"
}

# Main deployment pipeline
main() {
    local start_time=$(date +%s)
    
    # Trap to ensure cleanup on exit
    trap cleanup EXIT
    
    log "${BLUE}🚀 Starting Boatable deployment pipeline...${NC}"
    
    # Run deployment steps
    check_prerequisites
    install_dependencies
    run_linting
    run_typecheck
    run_tests
    generate_data
    build_application
    run_migrations
    deploy_firebase
    deploy_vercel
    invalidate_cache
    run_health_checks
    send_notifications
    
    # Calculate deployment time
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    local minutes=$((duration / 60))
    local seconds=$((duration % 60))
    
    echo "=================================================="
    log "${GREEN}🎉 Boatable deployment completed successfully!${NC}"
    log "${GREEN}⏱️  Total deployment time: ${minutes}m ${seconds}s${NC}"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        log "${GREEN}🌊 Maritime platform is now live at https://boatable.com${NC}"
    else
        log "${GREEN}🌊 Maritime platform is now live on staging${NC}"
    fi
    
    echo "=================================================="
}

# Help function
show_help() {
    echo "Boatable Platform Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [environment] [options]"
    echo ""
    echo "Environments:"
    echo "  production  Deploy to production (default)"
    echo "  staging     Deploy to staging"
    echo "  development Deploy to development"
    echo ""
    echo "Environment Variables:"
    echo "  SKIP_TESTS=true        Skip test execution"
    echo "  SKIP_BUILD=true        Skip application build"
    echo "  NOTIFY_SLACK=false     Disable Slack notifications"
    echo "  SLACK_WEBHOOK_URL      Slack webhook for notifications"
    echo "  DISCORD_WEBHOOK_URL    Discord webhook for notifications"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh production"
    echo "  SKIP_TESTS=true ./deploy.sh staging"
    echo "  NOTIFY_SLACK=false ./deploy.sh development"
}

# Handle command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac