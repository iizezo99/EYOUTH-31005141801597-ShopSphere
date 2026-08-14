import * as prismaPackage from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = prismaPackage;
 import "dotenv/config";
 
 const adapter = new PrismaPg({
   connectionString: process.env.DATABASE_URL,
 });
 const prisma = new PrismaClient({ adapter });
 
 const newCategory = await prisma.category.create({
      data: {"name":"electronicts"}
    });
