import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

import { usersTable } from "../auth/models";
import { commentsTable } from "../comment/models";
import { experiencesTable } from "../experience/models";

const notificationTypeEnum = [
  "user_attending_experience",
  "user_unattending_experience",
  "user_commented_experience",
  "user_followed_user",
  "user_kicked_experience",
] as const;

export const notificationsTable = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    type: text("type", {
      enum: notificationTypeEnum,
    }).notNull(),
    read: boolean().notNull().default(false),

    commentId: integer("comment_id").references(() => commentsTable.id, {
      onDelete: "cascade",
    }),
    experienceId: integer("experience_id").references(() => experiencesTable.id, {
      onDelete: "cascade",
    }),
    fromUserId: integer("from_user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    userId: integer("user_id").references(() => usersTable.id, {
      onDelete: "cascade",
    }),

    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    notifications_experience_id_idx: index(
      "notifications_experience_id_idx",
    ).on(table.experienceId),
    notifications_comment_id_idx: index("notifications_comment_id_idx").on(
      table.commentId,
    ),
    notifications_from_user_id_idx: index("notifications_from_user_id_idx").on(
      table.fromUserId,
    ),
    notifications_user_id_idx: index("notifications_user_id_idx").on(
      table.userId,
    ),
  }),
);

export const notificationSelectSchema = createSelectSchema(notificationsTable);

export type Notification = typeof notificationsTable.$inferSelect;
