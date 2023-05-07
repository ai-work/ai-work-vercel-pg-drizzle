import { index, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

const users = pgTable("users", {
    id: serial("id").primaryKey(),
    fullName: varchar("full_name", { length: 256 }),
  }
);

const todos = pgTable("todos", {
    id: serial("id").primaryKey(),
    todoDesc: varchar("todo_desc", { length: 256 }),
    userId: integer("user_id").references(() => users.id),
});

export { users, todos };