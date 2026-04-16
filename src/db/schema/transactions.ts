import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { products } from "./products";
import { users } from "./users";

export const transactiosTypeEnum = pgEnum("transactio_type", [
  "receipt",
  "dispatch",
]);
export const transactions = pgTable("transactions", {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  type: transactiosTypeEnum("type").notNull(),
  quantity: numeric("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
