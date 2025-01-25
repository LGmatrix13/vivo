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
export const statusEnum = pgEnum("status", [
  "INCOMPLETE",
  "SUBMITTED_BY_RESIDENT",
  "APPROVED",
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
export const rciTypeEnum = pgEnum("rciType", [
  "UPPER_CAMPUS",
  "APT_DOUBLE",
  "APT_TRIPLE",
  "APT_QUAD"
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
});

export const roomConditionItemsTable = pgTable("RoomConditionItems", {
  emergencyItems: varchar("emergency_items", { length: 225 }).notNull(),
  doorsLocks: varchar("doors_locks", { length: 225 }).notNull(),
  walls: varchar("walls", { length: 225 }).notNull(),
  floor: varchar("floor", { length: 225 }).notNull(),
  ceiling: varchar("ceiling", { length: 225 }).notNull(),
  lightsFixtures: varchar("lights_fixtures", { length: 225 }).notNull(),
  closetWardrobeMirror: varchar("closet_wardrobe_mirror", {
    length: 225,
  }).notNull(),
  windowsScreens: varchar("windows_screens", { length: 225 }).notNull(),
  curtainsRods: varchar("curtains_rods", { length: 225 }).notNull(),
  deskChair: varchar("desk_chair", { length: 225 }).notNull(),
  bedMattress: varchar("bed_mattress", { length: 225 }).notNull(),
  dresser: varchar("dresser", { length: 225 }).notNull(),
  bathroom: varchar("bathroom", { length: 225 }).notNull(),
  towelbarRings: varchar("towelbar_rings", { length: 225 }).notNull(),
  entryDoor: varchar("entry_door", { length: 225 }).notNull(),
  sinkDisposal: varchar("sink_disposal", { length: 225 }).notNull(),
  countertops: varchar("countertops", { length: 225 }).notNull(),
  dishwasher: varchar("dishwasher", { length: 225 }).notNull(),
  washerDryer: varchar("washer_dryer", { length: 225 }).notNull(),
  refrigerator: varchar("refrigerator", { length: 225 }).notNull(),
  stoveOven: varchar("stove_oven", { length: 225 }).notNull(),
  wallCabinets: varchar("wall_cabinets", { length: 225 }).notNull(),
  table: varchar("table", { length: 225 }).notNull(),
  chairs: varchar("chairs", { length: 225 }).notNull(),
  fireExtinguisher: varchar("fire_extinguisher", { length: 225 }).notNull(),
  livingRoomCeiling: varchar("living_room_ceiling", { length: 225 }).notNull(),
  livingRoomFloorCarpet: varchar("living_room_floor_carpet", {
    length: 225,
  }).notNull(),
  livingRoomWalls: varchar("living_room_walls", { length: 225 }).notNull(),
  sofa: varchar("sofa", { length: 225 }).notNull(),
  chair: varchar("chair", { length: 225 }).notNull(),
  sideTable: varchar("side_table", { length: 225 }).notNull(),
  tvStand: varchar("tv_stand", { length: 225 }).notNull(),
  windowBlinds: varchar("window_blinds", { length: 225 }).notNull(),
  bathroomEntryDoor: varchar("bathroom_entry_door", { length: 225 }).notNull(),
  bathroomCeiling: varchar("bathroom_ceiling", { length: 225 }).notNull(),
  bathroomFloor: varchar("bathroom_floor", { length: 225 }).notNull(),
  bathroomWalls: varchar("bathroom_walls", { length: 225 }).notNull(),
  bathroomCabinets: varchar("bathroom_cabinets", { length: 225 }).notNull(),
  bathroomMirror: varchar("bathroom_mirror", { length: 225 }).notNull(),
  sinkCounter: varchar("sink_counter", { length: 225 }).notNull(),
  tubShowerCurtain: varchar("tub_shower_curtain", { length: 225 }).notNull(),
  toilet: varchar("toilet", { length: 225 }).notNull(),
  bedroomLeftEntryDoor: varchar("bedroom_left_entry_door", {
    length: 225,
  }).notNull(),
  bedroomLeftCeiling: varchar("bedroom_left_ceiling", {
    length: 225,
  }).notNull(),
  bedroomLeftFloorCarpet: varchar("bedroom_left_floor_carpet", {
    length: 225,
  }).notNull(),
  bedroomLeftWalls: varchar("bedroom_left_walls", { length: 225 }).notNull(),
  bedroomLeftBedMattress: varchar("bedroom_left_bed_mattress", {
    length: 225,
  }).notNull(),
  bedroomLeftClosetMirror: varchar("bedroom_left_closet_mirror", {
    length: 225,
  }).notNull(),
  bedroomLeftDeskChair: varchar("bedroom_left_desk_chair", {
    length: 225,
  }).notNull(),
  bedroomLeftDresser: varchar("bedroom_left_dresser", {
    length: 225,
  }).notNull(),
  bedroomRightEntryDoor: varchar("bedroom_right_entry_door", {
    length: 225,
  }).notNull(),
  bedroomRightCeiling: varchar("bedroom_right_ceiling", {
    length: 225,
  }).notNull(),
  bedroomRightFloorCarpet: varchar("bedroom_right_floor_carpet", {
    length: 225,
  }).notNull(),
  bedroomRightWalls: varchar("bedroom_right_walls", { length: 225 }).notNull(),
  bedroomRightBedMattress: varchar("bedroom_right_bed_mattress", {
    length: 225,
  }).notNull(),
  bedroomRightClosetMirror: varchar("bedroom_right_closet_mirror", {
    length: 225,
  }).notNull(),
  bedroomRightDeskChair: varchar("bedroom_right_desk_chair", {
    length: 225,
  }).notNull(),
  bedroomRightDresser: varchar("bedroom_right_dresser", {
    length: 225,
  }).notNull(),

  studentSignature: varchar("student_signature", { length: 225 }).notNull(),
  RASignature: varchar("ra_signature", { length: 225 }).notNull(),
  studentDate: varchar("student_date", { length: 225 }).notNull(),
  RADate: varchar("ra_date", { length: 225 }).notNull(),
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
  submitted: date("submitted").notNull().defaultNow(),
  time: timestamp("time").notNull(),
  description: varchar("description", { length: 225 }).notNull(),
});

export const violationTable = pgTable("Violation", {
  id: serial("id").notNull().primaryKey(),
  roundReportId: integer("round_report_id")
    .notNull()
    .references(() => roundReportTable.id),
  description: varchar("description", { length: 225 }).notNull(),
});

export const consverationReportTable = pgTable("ConversationReport", {
  id: serial("id").notNull().primaryKey(),
  residentId: integer()
    .notNull()
    .references(() => residentTable.id),
  zoneId: integer()
    .notNull()
    .references(() => zoneTable.id),
  submitted: date("submitted").notNull().defaultNow(),
  explanation: varchar({ length: 225 }).notNull(),
  level: levelEnum().notNull(),
  sentiment: sentimentEnum().notNull(),
  highPriority: boolean().notNull().default(false),
});

export const eventReportTable = pgTable("EventReport", {
  id: serial("id").notNull().primaryKey(),
  time: timestamp("time").notNull(),
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
  submittedOn: date("submitted_on").defaultNow(),
  outstandWorkOrders: varchar({ length: 225 }),
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
  start: timestamp("start").notNull(),
  finish: timestamp("finish").notNull(),
});

export const staffShiftTable = pgTable("StaffShift", {
  id: serial("id").notNull().primaryKey(),
  staffId: integer().references(() => staffTable.id),
  start: timestamp("start").notNull(),
  finish: timestamp("finish").notNull(),
});

export const RCITable = pgTable("RCI", {
  id: serial("id").notNull().primaryKey(),
  residentId: integer("resident_id")
    .notNull()
    .references(() => residentTable.id), // Assumes there's a Residents table
  submittedOn: date("submitted_on").defaultNow().notNull(),
  issues: json().default({}),
  status: statusEnum().notNull(),
  signedOn: date("signed_on").defaultNow(),
  sentToLimble: boolean("sent_to_limble").notNull().default(false),
  rciType: rciTypeEnum().notNull()
});
