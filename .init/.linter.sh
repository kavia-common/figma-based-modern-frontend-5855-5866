#!/bin/bash
cd /home/kavia/workspace/code-generation/figma-based-modern-frontend-5855-5866/backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

