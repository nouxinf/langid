#!/usr/bin/env bash
set -euo pipefail

PORT=3130
LOG_DIR="$HOME/logs"
LOG_FILE="$LOG_DIR/langid.log"
PID_FILE="$LOG_DIR/langid.pid"

mkdir -p "$LOG_DIR"

# kill anything listening on port 3130
if command -v fuser >/dev/null 2>&1; then
  fuser -k "$PORT/tcp" >/dev/null 2>&1 || true
elif command -v lsof >/dev/null 2>&1; then
  PIDS="$(lsof -t -iTCP:"$PORT" -sTCP:LISTEN || true)"
  if [[ -n "$PIDS" ]]; then
    kill $PIDS 2>/dev/null || true
    sleep 1
    kill -9 $PIDS 2>/dev/null || true
  fi
else
  echo "Need fuser or lsof to kill process on port $PORT"
  exit 1
fi

: > "$LOG_FILE"

nohup bun serve.js >> "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"

echo "Started PID $(cat "$PID_FILE")"
echo "Logs: $LOG_FILE"

echo "Restarting nginx..."
if command -v systemctl >/dev/null 2>&1; then
  sudo nginx -t
  sudo systemctl restart nginx
else
  sudo service nginx restart
fi

echo "Nginx restarted"
