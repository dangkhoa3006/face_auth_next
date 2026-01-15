console.log("Test script started");

import "dotenv/config";
console.log("Dotenv loaded");

import { PrismaClient } from "@prisma/client";
console.log("PrismaClient imported");

const prisma = new PrismaClient();
console.log("PrismaClient created");

async function test() {
  try {
    const count = await prisma.user.count();
    console.log(`User count: ${count}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
