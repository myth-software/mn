import { pgTable, serial, text, varchar, uuidColumn } from "drizzle-orm/pg-core";
 
export const <%= camelize(title) %> = pgTable('<%= dasherize(title) %>', {
  id: uuidColumn.defaultRandom().primaryKey(),
  icon: text('icon').notNull(),
  cover: text('cover').notNull(),
  description: text('description').notNull(),  
});
