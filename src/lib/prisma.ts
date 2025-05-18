import { PrismaClient } from '@prisma/client'

interface CustomNodeJsGlobal {
  prisma: PrismaClient
}

declare const global: CustomNodeJsGlobal

if (!global.prisma) {
  global.prisma = new PrismaClient({
    log: ['error'],
  })
}

const prisma = global.prisma

export default prisma

export const disconnectPrisma = async () => {
  await prisma.$disconnect()
  console.log('연결해제')
}
