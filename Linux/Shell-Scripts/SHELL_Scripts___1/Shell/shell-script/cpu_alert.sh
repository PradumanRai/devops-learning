#!/bin/bash

THRESHOLD=90
EMAIL="pradumanrai9554@gmail.com"
HOSTNAME=$(hostname)
DATE=$(date)

# Get CPU usage (100 - idle)
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print 100 - $8}')

CPU_USAGE_INT=${CPU_USAGE%.*}

if [ "$CPU_USAGE_INT" -ge "$THRESHOLD" ]; then
    echo "ALERT: CPU usage is at ${CPU_USAGE}% on ${HOSTNAME} at ${DATE}" | \
    mail -s "CPU Alert on ${HOSTNAME}" "$EMAIL"
fi
