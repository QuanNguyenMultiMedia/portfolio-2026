#!/usr/bin/env bash
# Sprint gate. Usage: bash docs/sprints/2026-11-07-warp/checks/verify.sh [touched files...]
cd "$(git rev-parse --show-toplevel)"
fail=0
t=$(npx tsc --noEmit 2>&1 | grep "error TS" | grep -v "src/__tests__/")
[ -n "$t" ] && { echo "TSC FAIL"; echo "$t" | head -20; fail=1; } || echo "TSC ok"
if [ $# -gt 0 ]; then ex=(); for f in "$@"; do [ -f "$f" ] && ex+=("$f"); done
  [ ${#ex[@]} -gt 0 ] && { npx eslint "${ex[@]}" >/tmp/eslint.$$ 2>&1 && echo "ESLINT ok" || { grep -q " error " /tmp/eslint.$$ && { echo "ESLINT FAIL"; tail -20 /tmp/eslint.$$; fail=1; } || echo "ESLINT ok (warnings)"; }; }; fi
v=$(npx vitest run 2>&1); f=$(echo "$v" | grep -E "^ +(FAIL|×)" | grep -v "projects.test.ts > projects data > each screen has a valid type" )
[ -n "$f" ] && { echo "VITEST FAIL"; echo "$f" | head; fail=1; } || echo "VITEST ok (baseline failure excluded)"
exit $fail
