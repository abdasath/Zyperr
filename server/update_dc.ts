import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const movies = await prisma.movie.findMany({
    where: {
      franchise: 'DC Universe'
    }
  })
  console.log(movies.map(m => m.title))
}
main()
