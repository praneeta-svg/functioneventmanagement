CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY,
	"hall_id" integer NOT NULL,
	"customer_id" text NOT NULL,
	"customer_name" text NOT NULL,
	"event_type" text NOT NULL,
	"event_date" text NOT NULL,
	"guests" integer NOT NULL,
	"amount" numeric(10,2) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "halls" (
	"id" serial PRIMARY KEY,
	"vendor_id" text NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"capacity" integer NOT NULL,
	"price" numeric(10,2) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendor_services" (
	"id" serial PRIMARY KEY,
	"vendor_id" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"price" numeric(10,2) NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hall_id_halls_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("id");
--> statement-breakpoint
INSERT INTO "halls" ("vendor_id", "name", "location", "capacity", "price", "description") VALUES
('vowspace-curated', 'The Marigold Room', 'Jubilee Hills', 320, 145000.00, 'Sunset terrace, sculptural stage, and a dining room made for long celebrations.'),
('vowspace-curated', 'Paloma Courtyard', 'Banjara Hills', 180, 98000.00, 'An open-air courtyard with old-stone arches and a rain-ready glass canopy.'),
('vowspace-curated', 'House of Saffron', 'Financial District', 540, 225000.00, 'A dramatic column-free hall built for large weddings, launches, and galas.');
