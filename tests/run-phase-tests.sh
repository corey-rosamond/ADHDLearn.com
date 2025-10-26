#!/bin/bash

# ADHDLearn.com - Phase Test Runner
# Runs automated tests for completed phases

set -e  # Exit on error

echo "================================"
echo "ADHDLearn.com Phase Test Runner"
echo "================================"
echo ""

# Color codes
GREEN='\033[0.32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
PASSED_PHASES=0
FAILED_PHASES=0

# Change to project root
cd "$(dirname "$0")/.."
PROJECT_ROOT="$(pwd)"

echo "Project Root: $PROJECT_ROOT"
echo ""

# Function to run a phase test
run_phase_test() {
  local phase=$1
  local test_file="tests/automated/phase-${phase}.test.mjs"

  if [ ! -f "$test_file" ]; then
    echo -e "${YELLOW}⚠  Phase $phase: Test file not found (skipped)${NC}"
    return 0
  fi

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Running Phase $phase Tests"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if node "$test_file"; then
    echo -e "${GREEN}✅ Phase $phase: PASSED${NC}"
    ((PASSED_PHASES++))
    return 0
  else
    echo -e "${RED}❌ Phase $phase: FAILED${NC}"
    ((FAILED_PHASES++))
    return 1
  fi
}

# Run tests for completed phases
echo "Testing completed phases (1-4)..."
echo ""

run_phase_test "01" || true
run_phase_test "02" || true
run_phase_test "03" || true
run_phase_test "04" || true

# Summary
echo ""
echo "================================"
echo "Test Summary"
echo "================================"
echo -e "${GREEN}Passed: $PASSED_PHASES phases${NC}"
echo -e "${RED}Failed: $FAILED_PHASES phases${NC}"
echo ""

if [ $FAILED_PHASES -eq 0 ]; then
  echo -e "${GREEN}✅ All phase tests PASSED!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed. Review output above.${NC}"
  exit 1
fi
