#!/usr/bin/env node

// Script để tạo file default.js cho Prisma client
const fs = require('fs');
const path = require('path');

const prismaClientPath = path.join(__dirname, '../node_modules/.prisma/client');
const defaultJsPath = path.join(prismaClientPath, 'default.js');

// Tạo file default.js
const content = `// Auto-generated file for Prisma client compatibility
// This file is created to fix the "Cannot find module '.prisma/client/default'" error
// Export PrismaClient bằng cách require từ @prisma/client sau khi module load xong

// Sử dụng một function để delay require và tránh circular dependency
function createPrismaClientExport() {
  // Require @prisma/client sau khi module đã load xong
  const prismaModule = require('@prisma/client');
  
  // Lấy PrismaClient từ module
  let PrismaClient = prismaModule.PrismaClient;
  
  // Nếu không có, thử từ default export
  if (!PrismaClient && prismaModule.default) {
    PrismaClient = prismaModule.default.PrismaClient || prismaModule.default;
  }
  
  return PrismaClient;
}

// Export với getter để lazy load
const exportsObj = {
  get PrismaClient() {
    return createPrismaClientExport();
  },
};

// Set property trực tiếp sau khi module load
setImmediate(() => {
  try {
    const PrismaClient = createPrismaClientExport();
    if (PrismaClient) {
      exportsObj.PrismaClient = PrismaClient;
    }
  } catch (e) {
    // Ignore errors
  }
});

module.exports = exportsObj;
module.exports.default = module.exports;
`;

fs.writeFileSync(defaultJsPath, content);
console.log('✅ Created/Updated .prisma/client/default.js');
