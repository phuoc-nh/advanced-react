// import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from 'drizzle-zod';

export const usersTable = pgTable("users", {
  id: serial('id').primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const userSelectSchema = createSelectSchema(usersTable);

export const cleanUserSelectSchema = userSelectSchema.omit({
  password: true,
  email: true,
});

export const userFollowsTable = pgTable(
  "user_follows",
  {
    followerId: integer("follower_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    followingId: integer("following_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.followerId, table.followingId] }),
  }),
);

type FullUser = typeof usersTable.$inferSelect;

export type CurrentUser = FullUser;

export type User = Omit<FullUser, "email" | "password">;
