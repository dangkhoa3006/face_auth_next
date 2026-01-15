#!/bin/bash

# Script để chạy migration với password từ environment variable
# Usage: PGPASSWORD=your_password ./scripts/run-migration.sh

set -e

echo "🔧 Bắt đầu migration..."

# Kiểm tra DATABASE_URL hoặc sử dụng giá trị mặc định
if [ -z "$DATABASE_URL" ]; then
    DB_USER="${DB_USER:-faceuser}"
    DB_NAME="${DB_NAME:-face_auth_db}"
    DB_HOST="${DB_HOST:-localhost}"
    echo "⚠️  DATABASE_URL không được set, sử dụng: $DB_USER@$DB_HOST/$DB_NAME"
else
    # Parse DATABASE_URL
    DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    echo "📝 Sử dụng DATABASE_URL: $DB_USER@$DB_HOST/$DB_NAME"
fi

# Chạy migration SQL
echo "📦 Chạy migration SQL..."
if [ -n "$PGPASSWORD" ]; then
    export PGPASSWORD
    psql -U "$DB_USER" -d "$DB_NAME" -h "$DB_HOST" -f scripts/manual-migration.sql
else
    echo "⚠️  PGPASSWORD không được set"
    echo "💡 Chạy: PGPASSWORD=your_password ./scripts/run-migration.sh"
    echo "💡 Hoặc chạy thủ công: psql -U $DB_USER -d $DB_NAME -h $DB_HOST -f scripts/manual-migration.sql"
    exit 1
fi

echo "✅ Migration SQL hoàn tất!"

# Generate Prisma Client
echo "🔨 Generate Prisma Client..."
npx prisma generate

echo "✅ Hoàn tất!"
