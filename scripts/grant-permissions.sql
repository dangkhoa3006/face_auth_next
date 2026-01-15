-- Script để cấp quyền cho PostgreSQL user
-- Chạy script này với user postgres hoặc superuser
-- psql -U postgres -d face_auth_db -f scripts/grant-permissions.sql

-- Thay 'your_db_user' bằng username PostgreSQL của bạn (thường là từ DATABASE_URL)
-- Ví dụ: nếu DATABASE_URL là postgresql://myuser:password@localhost:5432/face_auth_db
-- thì username là 'myuser'

-- Cấp quyền ALTER TABLE
ALTER TABLE "User" OWNER TO your_db_user;

-- Hoặc cấp quyền đầy đủ cho schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO your_db_user;
