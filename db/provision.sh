#!/bin/bash
# Provisioning script for the Enterprise RAG Database

echo "Checking database connectivity..."
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL is not set."
    exit 1
fi

echo "Applying Schema (DDL)..."
psql $DATABASE_URL -f db/schema.sql

echo "Provisioning complete."
