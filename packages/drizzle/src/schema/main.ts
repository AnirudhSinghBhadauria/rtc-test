import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  name: text("name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transaction = pgTable("transaction", {
  id: serial("id").primaryKey(),
  sender: integer("sender_user_id").references(() => user.id),
  recipient: integer("recipient_user_id").references(() => user.id),
});


// using render for postgres provider - 
// add ?ssl=true after the connection string, otherwise it would give ssl/ttl error!

// Running studio - npx drizzle-kit stuido
// Migrations - npx drizzle-kit push:pg

// Manual Migrations - first make scripts in package.json
// 1. npm run main:generate
// 2. npm run main:migrate