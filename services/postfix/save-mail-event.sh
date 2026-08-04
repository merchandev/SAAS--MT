#!/bin/bash
# Reads a DSN email from stdin and saves it to a unique file in the spool directory

SPOOL_DIR="/var/spool/mail-events"
FILENAME="$SPOOL_DIR/dsn_$(date +%s%N)_$$.eml"

cat > "$FILENAME"
chmod 644 "$FILENAME"
