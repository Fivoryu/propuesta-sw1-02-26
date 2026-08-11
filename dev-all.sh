#!/usr/bin/env bash
# dev-all.sh — run every proposal dev server on its own port.
# Usage: bash dev-all.sh   (Ctrl+C stops all servers)
set -uo pipefail
cd "$(dirname "$0")" || exit 1

PIDS=()
cleanup() {
	echo
	echo "Stopping all dev servers..."
	kill "${PIDS[@]}" 2>/dev/null || true
	wait 2>/dev/null || true
	echo "Done."
}
trap cleanup INT TERM EXIT

start() {
	local name="$1" port="$2" script="$3"
	# --if-present: skip silently when the script does not exist yet (pre-merge).
	(corepack pnpm --if-present "$script" 2>&1 | sed "s/^/[$name] /") &
	PIDS+=("$!")
	echo "[$name] starting on http://localhost:$port (pnpm $script)"
}

start "portal" "5173" "dev:portal"
start "barrio" "5174" "dev:barrio"
start "cuaderno" "5175" "dev:cuaderno"
start "mascota" "5176" "dev:mascota"
start "nutrivision" "5177" "dev:nutrivision"
start "signbridge" "5178" "dev:signbridge"

echo
echo "All dev servers launched. Open each port in your browser."
echo "Press Ctrl+C to stop everything."
echo

wait
