import { integer, pgEnum, pgTable, varchar, unique, doublePrecision, timestamp } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("genders", ["male", "female"]);

export const residentTable = pgTable("Resident", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    firstName: varchar('first_name', { length: 225 }).notNull(),
    lastName: varchar('last_name', { length: 225 }).notNull(),
    emailAddress: varchar('email_addresss', { length: 225 }).notNull(),
    city: varchar('city', { length: 225 }).notNull(),
    state: varchar('state', { length: 225 }).notNull(),
    phoneNumber: varchar('phone_number', { length: 225 }).notNull(),
    mailbox: varchar('mailbox', { length: 225 }).notNull(),
    class: varchar('class', { length: 225 }).notNull(),
    gender: genderEnum('gender').notNull(),
    studentId: integer('student_id').notNull(),
    zoneId: integer('zone_id').references(() => zoneTable.id),
    roomId: integer('room_id').references(() => roomTable.id)
})

export const zoneTable = pgTable("Zone", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    residentId: integer('resident_id').notNull(),
    staffId: integer('staff_id').references(() => staffTable.id)
});

export const roomTable = pgTable("Room", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    roomNumber: varchar('room_number', { length: 225 }).notNull(),
    buildingId: integer('building_id').notNull().references(() => buildingTable.id),
    capacity: integer('capacity').notNull(),
});

export const assistantStaffTable = pgTable("AssistantStaff", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    residentId: integer('resident_id').notNull().references(() => residentTable.id),
    staffId: integer('staff_id').notNull().references(() => staffTable.id)
})

export const staffTable = pgTable("Staff", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    firstName: varchar('first_name', { length: 225 }).notNull(),
    lastName: varchar('last_name', { length: 225 }).notNull(),
    emailAddress: varchar('email_address', { length: 225 }).notNull(),
    mailbox: varchar('mailbox', { length: 225 }).notNull(),
    gender: genderEnum('gender')
})

export const adminTable = pgTable("Admin", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    firstName: varchar('first_name', { length: 225 }).notNull(),
    lastName: varchar('last_name', { length: 225 }).notNull(),
    emailAddress: varchar('email_address', { length: 225 }).notNull(),
    mailbox: varchar('mailbox', { length: 225 }).notNull()
})

export const buildingTable = pgTable("Building", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name', { length: 225 }).notNull(),
    staffId: integer('staff_ids').notNull().references(() => staffTable.id),
    latitude: doublePrecision('latitude'),
    longitude: doublePrecision('longitude')
})

export const roundReportTable = pgTable("RoundReport", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    zoneId: integer('zone_id').notNull().references(() => zoneTable.id),
    submitted: timestamp('submitted').notNull().defaultNow(),
    time: timestamp('time').notNull(),
    description: varchar('description', { length: 225 }).notNull(),
})

export const violationTable = pgTable("Violation", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    roundReportId: integer("round_report_id").notNull().references(() => roundReportTable.id),
    description: varchar("description", { length: 225 }).notNull()
})

export const outstandWorkOrderTable = pgTable("OutstandingWorkOrder", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    roundId: integer("round_report_id").notNull().references(() => roundReportTable.id),
    description: varchar("description", { length: 225 }).notNull()
})