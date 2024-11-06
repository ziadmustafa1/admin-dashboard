import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    // Delete existing users to avoid duplicates
    await prisma.user.deleteMany({
      where: {
        email: 'admin@example.com'
      }
    })

    // Create admin user
    const hashedPassword = bcrypt.hashSync('admin123', 10)

    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      },
    })

    console.log('Created admin user:', admin)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })