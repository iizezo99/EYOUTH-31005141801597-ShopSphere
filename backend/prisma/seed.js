import * as prismaPackage from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from 'bcryptjs';
import "dotenv/config";

const { PrismaClient } = prismaPackage;

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seeding...");

  // A. Seed Users
  const hashedPassword = await bcrypt.hash("123456", 10);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Customer User",
      email: "customer@example.com",
      password: hashedPassword,
      role: "customer",
    },
  });

  console.log(`✅ Created users: ${admin.email}, ${customer.email}`);

  // B. Seed Categories
  const electronics = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: {},
    create: { name: "Electronics" },
  });

  const clothing = await prisma.category.upsert({
    where: { name: "Clothing" },
    update: {},
    create: { name: "Clothing" },
  });

  console.log(`✅ Created categories: ${electronics.name}, ${clothing.name}`);

  // C. Seed Products
  await prisma.product.deleteMany();

  const products = await prisma.product.createMany({
    data: [
      // Electronics (8 products)
      {
        name: "iPhone 16 Pro",
        price: 1199.99,
        description: "The latest flagship phone with A18 chip.",
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80",
        categoryId: electronics.id,
      },
      {
        name: "Samsung Galaxy S24",
        price: 999.99,
        description: "The ultimate Android flagship.",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
        categoryId: electronics.id,
      },
      {
        name: "MacBook Pro M4",
        price: 1999.99,
        description: "Professional laptop with M4 chip.",
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
        categoryId: electronics.id,
      },
      {
        name: "Sony WH-1000XM5",
        price: 349.99,
        description: "Industry-leading noise-canceling headphones.",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
        categoryId: electronics.id,
      },
      {
        name: "iPad Air",
        price: 599.99,
        description: "Powerful tablet for work and play.",
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80",
        categoryId: electronics.id,
      },
      {
        name: "PlayStation 5",
        price: 499.99,
        description: "Next-gen gaming console.",
        imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
        categoryId: electronics.id,
      },
      {
        name: "Apple Watch Series 9",
        price: 399.99,
        description: "Smartwatch with health tracking.",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
        categoryId: electronics.id,
      },
      {
        name: "Nintendo Switch OLED",
        price: 349.99,
        description: "Hybrid gaming console.",
        imageUrl: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1200&q=80",
        categoryId: electronics.id,
      },
      // Clothing (7 products)
      {
        name: "Leather Jacket",
        price: 249.99,
        description: "Premium leather jacket for men and women.",
        imageUrl: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1200&q=80",
        categoryId: clothing.id,
      },
      {
        name: "Denim Jeans",
        price: 79.99,
        description: "Classic fit denim jeans.",
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80",
        categoryId: clothing.id,
      },
      {
        name: "Cotton T-Shirt",
        price: 29.99,
        description: "Soft organic cotton t-shirt.",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
        categoryId: clothing.id,
      },
      {
        name: "Running Shoes",
        price: 129.99,
        description: "Lightweight running shoes.",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
        categoryId: clothing.id,
      },
      {
        name: "Wool Sweater",
        price: 89.99,
        description: "Cozy merino wool sweater.",
        imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
        categoryId: clothing.id,
      },
      {
        name: "Hoodie",
        price: 59.99,
        description: "Comfortable pullover hoodie.",
        imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
        categoryId: clothing.id,
      },
      {
        name: "Casual Blazer",
        price: 179.99,
        description: "Smart casual blazer.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
        categoryId: clothing.id,
      },
    ],
  });

  console.log(`✅ Created ${products.count} products`);
}

// Run the seed
main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🌱 Seeding complete!");
  });
