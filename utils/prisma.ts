import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 * Disconnects from the Prisma client.
 * @returns A Promise that resolves when the disconnection is complete.
 */
export async function PrismaMain(): Promise<void> {
  try {
    await prisma.$disconnect()
  } catch (e: any) {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}
