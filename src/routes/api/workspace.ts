import { createFileRoute } from '@tanstack/react-router'
import { getUser } from '@netlify/identity'
import { desc, eq, inArray } from 'drizzle-orm'
import { db } from '../../../db/index.js'
import { bookings, halls, vendorServices } from '../../../db/schema.js'

async function currentUser() {
  const user = await getUser()
  if (!user) throw new Response('Unauthorized', { status: 401 })
  return user
}

export const Route = createFileRoute('/api/workspace')({
  server: { handlers: {
    GET: async () => {
      try {
        const user = await currentUser()
        const role = user.roles?.includes('admin') ? 'admin' : user.userMetadata?.account_type === 'vendor' ? 'vendor' : 'customer'
        const allHalls = await db.select().from(halls).where(eq(halls.active, true)).orderBy(halls.name)
        let visibleBookings = [] as typeof bookings.$inferSelect[]
        if (role === 'admin') visibleBookings = await db.select().from(bookings).orderBy(desc(bookings.createdAt))
        else if (role === 'vendor') {
          const ownedIds = allHalls.filter((hall) => hall.vendorId === user.id).map((hall) => hall.id)
          visibleBookings = ownedIds.length ? await db.select().from(bookings).where(inArray(bookings.hallId, ownedIds)).orderBy(desc(bookings.createdAt)) : []
        } else visibleBookings = await db.select().from(bookings).where(eq(bookings.customerId, user.id)).orderBy(desc(bookings.createdAt))
        const services = role === 'vendor' ? await db.select().from(vendorServices).where(eq(vendorServices.vendorId, user.id)) : []
        return Response.json({ role, halls: allHalls, bookings: visibleBookings, services })
      } catch (error) { return error instanceof Response ? error : Response.json({ error: 'Unable to load workspace' }, { status: 500 }) }
    },
    POST: async ({ request }) => {
      try {
        const user = await currentUser()
        const body = await request.json() as Record<string, unknown>
        if (body.action === 'book') {
          const hallId = Number(body.hallId); const guests = Number(body.guests)
          const [hall] = await db.select().from(halls).where(eq(halls.id, hallId)).limit(1)
          if (!hall) return Response.json({ error: 'Hall not found' }, { status: 404 })
          const [created] = await db.insert(bookings).values({ hallId, customerId: user.id, customerName: user.name || user.email || 'Guest', eventType: String(body.eventType || 'Celebration'), eventDate: String(body.eventDate || ''), guests, amount: hall.price }).returning()
          return Response.json(created, { status: 201 })
        }
        if (body.action === 'hall') {
          const role = user.roles?.includes('admin') ? 'admin' : user.userMetadata?.account_type
          if (role !== 'vendor' && role !== 'admin') return new Response('Forbidden', { status: 403 })
          const [created] = await db.insert(halls).values({ vendorId: user.id, name: String(body.name), location: String(body.location), capacity: Number(body.capacity), price: String(body.price), description: String(body.description || '') }).returning()
          return Response.json(created, { status: 201 })
        }
        if (body.action === 'status') {
          const roles = user.roles ?? []
          if (!roles.includes('admin') && user.userMetadata?.account_type !== 'vendor') return new Response('Forbidden', { status: 403 })
          if (!roles.includes('admin')) {
            const [target] = await db.select({ vendorId: halls.vendorId }).from(bookings).innerJoin(halls, eq(bookings.hallId, halls.id)).where(eq(bookings.id, Number(body.bookingId))).limit(1)
            if (!target || target.vendorId !== user.id) return new Response('Forbidden', { status: 403 })
          }
          const [updated] = await db.update(bookings).set({ status: String(body.status) }).where(eq(bookings.id, Number(body.bookingId))).returning()
          return Response.json(updated)
        }
        return Response.json({ error: 'Unknown action' }, { status: 400 })
      } catch (error) { return error instanceof Response ? error : Response.json({ error: 'Unable to save changes' }, { status: 500 }) }
    },
  } },
})
