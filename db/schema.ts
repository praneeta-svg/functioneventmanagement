import { boolean, integer, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const halls = pgTable('halls', {
  id: serial().primaryKey(),
  vendorId: text('vendor_id').notNull(),
  name: text().notNull(),
  location: text().notNull(),
  capacity: integer().notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  description: text().notNull().default(''),
  active: boolean().notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const bookings = pgTable('bookings', {
  id: serial().primaryKey(),
  hallId: integer('hall_id').notNull().references(() => halls.id),
  customerId: text('customer_id').notNull(),
  customerName: text('customer_name').notNull(),
  eventType: text('event_type').notNull(),
  eventDate: text('event_date').notNull(),
  guests: integer().notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: text().notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const vendorServices = pgTable('vendor_services', {
  id: serial().primaryKey(),
  vendorId: text('vendor_id').notNull(),
  title: text().notNull(),
  category: text().notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  active: boolean().notNull().default(true),
})
