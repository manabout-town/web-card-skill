#!/usr/bin/env bash
# web-card 스킬 설치 → ~/.claude/skills/web-card
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p ~/.claude/skills
rm -rf ~/.claude/skills/web-card
cp -R skill/web-card ~/.claude/skills/
echo "✓ 설치 끝: ~/.claude/skills/web-card"
