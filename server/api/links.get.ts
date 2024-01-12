import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { PrismaMain } from '~/utils/prisma'

export default defineEventHandler(async (event) => {

  PrismaMain(); {
    const staticLinks = await prisma.links.findMany({})
    return {
      staticLinks,
      staticImageUrl: `https://gripp.run/img?img=https://gripp.run/static/profile13.jpg&quality=13&grey=true`
    }
  }
})