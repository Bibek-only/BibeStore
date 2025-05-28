import { PrismaClient } from "@prisma/client";
import { varible } from "@/schemas/envSchema";

const prismaClientSingleton = () => {

    return new PrismaClient();
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (varible.NODE_ENV !== 'production') globalThis.prisma = prisma