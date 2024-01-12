import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { PrismaMain } from '~/utils/prisma'

export default defineEventHandler(async (event) => {

  PrismaMain();  {
    const link = await prisma.links.create({
      data: {
        url: 'https://google.com',
        label: 'google',
        colorFg: 'red'
      }
    })
    return link
  }

})