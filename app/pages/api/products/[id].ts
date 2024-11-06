import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const product = await prisma.product.findUnique({
        where: { id: id as string },
      })
      if (product) {
        res.status(200).json(product)
      } else {
        res.status(404).json({ error: 'Product not found' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching product' })
    }
  } else if (req.method === 'PUT') {
    try {
      const product = await prisma.product.update({
        where: { id: id as string },
        data: req.body,
      })
      res.status(200).json(product)
    } catch (error) {
      res.status(500).json({ error: 'Error updating product' })
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.product.delete({
        where: { id: id as string },
      })
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ error: 'Error deleting product' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}