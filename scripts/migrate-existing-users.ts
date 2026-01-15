/**
 * Script để migrate dữ liệu users hiện có
 * Chạy script này sau khi đã push schema mới
 * 
 * Usage: npx tsx scripts/migrate-existing-users.ts
 */

// Load .env file trước khi import các module khác
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

console.log("🚀 Script migration đã được khởi động...");

// Kiểm tra DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL không được set trong environment variables!");
  console.error("💡 Đảm bảo file .env có DATABASE_URL");
  process.exit(1);
}

const prisma = new PrismaClient();

async function migrateExistingUsers() {
  try {
    console.log("🔧 Bắt đầu migrate dữ liệu users...");
    console.log(`📡 DATABASE_URL: ${process.env.DATABASE_URL ? "Đã set" : "CHƯA SET"}`);

    // Kiểm tra tổng số users
    const totalUsers = await prisma.user.count();
    console.log(`📊 Tổng số users trong database: ${totalUsers}`);

    if (totalUsers === 0) {
      console.log("✅ Không có users nào trong database. Migration không cần thiết.");
      return;
    }

    // Lấy tất cả users
    const allUsers = await prisma.user.findMany();
    console.log(`📋 Đã load ${allUsers.length} users từ database`);
    
    // Lọc users cần migrate
    const users = allUsers.filter(user => 
      !user.name || user.name === "" ||
      !user.sdt || user.sdt === "" ||
      user.password.startsWith("$2a$10$default")
    );

    console.log(`📝 Tìm thấy ${users.length} users cần migrate`);
    
    if (users.length === 0) {
      console.log("✅ Tất cả users đã được migrate. Không cần cập nhật.");
      return;
    }

    for (const user of users) {
      const updates: {
        name?: string;
        sdt?: string;
        password?: string;
      } = {};

      // Nếu thiếu name, dùng email prefix làm tên mặc định
      if (!user.name || user.name === "") {
        updates.name = user.email.split("@")[0];
      }

      // Nếu thiếu sdt, tạo số điện thoại mặc định (cần user cập nhật sau)
      if (!user.sdt || user.sdt === "") {
        updates.sdt = `temp_${user.id.substring(0, 8)}`;
      }

      // Nếu password là default, tạo password mặc định (cần user đổi sau)
      if (user.password.startsWith("$2a$10$default")) {
        const defaultPassword = await bcrypt.hash("ChangeMe123!", 10);
        updates.password = defaultPassword;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updates,
      });

      console.log(`✓ Đã migrate user: ${user.email}`);
    }

    console.log("✓ Migration hoàn tất!");
  } catch (error) {
    console.error("Lỗi khi migrate:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateExistingUsers();
