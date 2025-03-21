import {
  integer,
  pgEnum,
  pgTable,
  varchar,
  doublePrecision,
  timestamp,
  serial,
  date,
  boolean,
  json,
  primaryKey,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("genders", ["MALE", "FEMALE"]);
export const levelEnum = pgEnum("levels", ["1", "2", "3"]);
export const sentimentEnum = pgEnum("sentiment", [
  "POSITIVE",
  "NEUTRAL",
  "NEGATIVE",
]);
export const RCIStatusEnum = pgEnum("status", [
  "AWAITING_RESIDENT",
  "AWAITING_RA",
  "ACTIVE",
  "RESIDENT_CHECKOUT",
  "RA_CHECKOUT",
  "CHECKED_OUT",
]);
export const ratingEnum = pgEnum("rating", [
  "GREAT",
  "GOOD",
  "OK",
  "ROUGH",
  "REALLY_ROUGH",
]);
export const reportTypeEnum = pgEnum("reportType", [
  "RCI",
  "CONVERSATION",
  "WEEKLY",
  "ROUND",
  "EVENT",
]);
export const personTypeEnum = pgEnum("personType", [
  "ZONE",
  "STAFF",
  "ASSISTANT_STAFF",
  "ADMIN",
]);
export const roomTypeEnum = pgEnum("roomType", [
  "UPPER_CAMPUS",
  "COLONIAL_DOUBLE",
  "COLONIAL_TRIPLE",
  "COLONIAL_QUAD",
]);

export const residentTable = pgTable("Resident", {
  id: serial("id").notNull().primaryKey(),
  firstName: varchar("first_name", { length: 225 }).notNull(),
  lastName: varchar("last_name", { length: 225 }).notNull(),
  emailAddress: varchar("email_address", { length: 225 }).notNull(),
  city: varchar("city", { length: 225 }),
  state: varchar("state", { length: 225 }),
  phoneNumber: varchar("phone_number", { length: 225 }),
  mailbox: varchar("mailbox", { length: 225 }),
  class: varchar("class", { length: 225 }).notNull(),
  gender: genderEnum("gender").notNull(),
  studentId: integer("student_id").notNull(),
  roomId: integer("room_id").references(() => roomTable.id),
});

export const zoneTable = pgTable("Zone", {
  id: serial("id").notNull().primaryKey(),
  residentId: integer("resident_id").notNull(),
  alias: varchar({ length: 225 }).notNull(),
  staffId: integer("staff_id").references(() => staffTable.id),
});

export const roomTable = pgTable("Room", {
  id: serial("id").notNull().primaryKey(),
  roomNumber: varchar("room_number", { length: 225 }).notNull(),
  buildingId: integer("building_id")
    .notNull()
    .references(() => buildingTable.id),
  zoneId: integer("zone_id").references(() => zoneTable.id),
  capacity: integer("capacity").notNull(),
  roomType: roomTypeEnum().notNull(),
  issuesRCI: json("issues_RCI").notNull().default({}),
});

export const assistantStaffTable = pgTable("AssistantStaff", {
  id: serial("id").notNull().primaryKey(),
  residentId: integer("resident_id")
    .notNull()
    .references(() => residentTable.id),
  staffId: integer("staff_id")
    .notNull()
    .references(() => staffTable.id),
});

export const staffTable = pgTable("Staff", {
  id: serial("id").notNull().primaryKey(),
  firstName: varchar("first_name", { length: 225 }).notNull(),
  lastName: varchar("last_name", { length: 225 }).notNull(),
  emailAddress: varchar("email_address", { length: 225 }).notNull(),
  mailbox: varchar("mailbox", { length: 225 }).notNull(),
  gender: genderEnum("gender").notNull(),
});

export const adminTable = pgTable("Admin", {
  id: serial("id").notNull().primaryKey(),
  firstName: varchar("first_name", { length: 225 }).notNull(),
  lastName: varchar("last_name", { length: 225 }).notNull(),
  emailAddress: varchar("email_address", { length: 225 }).notNull(),
  mailbox: varchar("mailbox", { length: 225 }).notNull(),
});

export const buildingTable = pgTable("Building", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 225 }).notNull(),
  staffId: integer("staff_id")
    .notNull()
    .references(() => staffTable.id),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
});

export const roundReportTable = pgTable("RoundReport", {
  id: serial("id").notNull().primaryKey(),
  zoneId: integer("zone_id")
    .notNull()
    .references(() => zoneTable.id),
  submitted: timestamp("submitted", { mode: "string" }).notNull().defaultNow(),
  time: timestamp("time", { mode: "string" }).notNull(),
  description: varchar("description", { length: 225 }).notNull(),
  violations: varchar("violations", { length: 225 }),
  outstandingWorkOrders: varchar("outstanding_work_orders", {
    length: 225,
  }),
});

export const consverationReportTable = pgTable("ConversationReport", {
  id: serial("id").notNull().primaryKey(),
  residentId: integer()
    .notNull()
    .references(() => residentTable.id),
  zoneId: integer()
    .notNull()
    .references(() => zoneTable.id),
  submitted: timestamp("submitted", { mode: "string" }).notNull().defaultNow(),
  explanation: varchar({ length: 225 }).notNull(),
  level: levelEnum().notNull(),
  sentiment: sentimentEnum().notNull(),
  highPriority: boolean().notNull().default(false),
});

export const eventReportTable = pgTable("EventReport", {
  id: serial("id").notNull().primaryKey(),
  time: timestamp("time", { mode: "string" }).notNull(),
  description: varchar("description", { length: 225 }).notNull(),
  attendance: integer().notNull(),
  zoneId: integer("zone_id")
    .notNull()
    .references(() => zoneTable.id),
});

export const readTable = pgTable(
  "Read",
  {
    personId: integer().notNull(),
    reportType: reportTypeEnum().notNull(),
    reportId: integer().notNull(),
    personType: personTypeEnum().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [
          table.reportId,
          table.reportType,
          table.personType,
          table.personId,
        ],
      }),
    };
  }
);

export const weeklyReportTable = pgTable("WeeklyReport", {
  id: serial("id").notNull().primaryKey(),
  zoneId: integer()
    .notNull()
    .references(() => zoneTable.id),
  submitted: timestamp("submitted", { mode: "string" }).defaultNow().notNull(),
  staffMeetingSuggestions: varchar({ length: 225 }),
  raResponsibilities: ratingEnum().notNull(),
  academics: ratingEnum().notNull(),
  spiritualHealth: ratingEnum().notNull(),
  physicalHealth: ratingEnum().notNull(),
  mentalHealth: ratingEnum().notNull(),
  personalLife: ratingEnum().notNull(),
  technologyAndMedia: ratingEnum().notNull(),
  explainChoices: varchar({ length: 225 }).notNull(),
});

export const zoneShiftTable = pgTable("ZoneShift", {
  id: serial("id").notNull().primaryKey(),
  zoneId: integer().references(() => zoneTable.id),
  date: date("date", { mode: "string" }).notNull(),
});

export const staffShiftTable = pgTable("StaffShift", {
  id: serial("id").notNull().primaryKey(),
  staffId: integer().references(() => staffTable.id),
  date: date("date", { mode: "string" }).notNull(),
});

export const RCITable = pgTable("RCI", {
  id: serial("id").notNull().primaryKey(),
  residentId: integer("resident_id")
    .notNull()
    .references(() => residentTable.id),
  issues: json().notNull().default({}),
  checkoutIssues: json(),
  submitted: timestamp({ mode: "string" }).defaultNow().notNull(),
  checkedOut: timestamp({ mode: "string" }),
  status: RCIStatusEnum().notNull(),
});
