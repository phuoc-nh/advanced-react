import {
  index,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

export const tagsTable = pgTable(
  "tags",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    tags_name_idx: index("tags_name_idx").on(table.name),
  }),
);

export const tagSelectSchema = createSelectSchema(tagsTable);

export type Tag = typeof tagsTable.$inferSelect;
