import { integer, pgEnum, pgTable, varchar, doublePrecision, timestamp, serial, date } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("genders", ["MALE", "FEMALE"]);
export const levelEnum = pgEnum("levels", ["1", "2", "3"])
export const sentimentEnum = pgEnum("sentiment", ["POSITIVE", "NEUTRAL", 'NEGATIVE'])
export const statusEnum = pgEnum('status', [
    'INCOMPLETE',
    'SUBMITTED_BY_RESIDENT',
    'SENT_TO_LIMBLE',
    'APPROVED'
]);

export const residentTable = pgTable("Resident", {
    id: serial('id').primaryKey(),
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
    id: serial('id').primaryKey(),
    residentId: integer('resident_id').notNull(),
    staffId: integer('staff_id').references(() => staffTable.id)
});

export const roomTable = pgTable("Room", {
    id: serial('id').primaryKey(),
    roomNumber: varchar('room_number', { length: 225 }).notNull(),
    buildingId: integer('building_id').notNull().references(() => buildingTable.id),
    capacity: integer('capacity').notNull(),
});

export const assistantStaffTable = pgTable("AssistantStaff", {
    id: serial('id').primaryKey(),
    residentId: integer('resident_id').notNull().references(() => residentTable.id),
    staffId: integer('staff_id').notNull().references(() => staffTable.id)
})

export const staffTable = pgTable("Staff", {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 225 }).notNull(),
    lastName: varchar('last_name', { length: 225 }).notNull(),
    emailAddress: varchar('email_address', { length: 225 }).notNull(),
    mailbox: varchar('mailbox', { length: 225 }).notNull(),
    gender: genderEnum('gender')
})

export const adminTable = pgTable("Admin", {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 225 }).notNull(),
    lastName: varchar('last_name', { length: 225 }).notNull(),
    emailAddress: varchar('email_address', { length: 225 }).notNull(),
    mailbox: varchar('mailbox', { length: 225 }).notNull()
})

export const buildingTable = pgTable("Building", {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 225 }).notNull(),
    staffId: integer('staff_id').notNull().references(() => staffTable.id),
    latitude: doublePrecision('latitude'),
    longitude: doublePrecision('longitude')
})

export const roundReportTable = pgTable("RoundReport", {
    id: serial('id').primaryKey(),
    zoneId: integer('zone_id').notNull().references(() => zoneTable.id),
    submitted: date('submitted').notNull().defaultNow(),
    time: timestamp('time').notNull(),
    description: varchar('description', { length: 225 }).notNull(),
})

export const violationTable = pgTable("Violation", {
    id: serial('id').primaryKey(),
    roundReportId: integer("round_report_id").notNull().references(() => roundReportTable.id),
    description: varchar("description", { length: 225 }).notNull()
})

export const outstandWorkOrderTable = pgTable("OutstandingWorkOrder", {
    id: serial("id").primaryKey(),
    roundId: integer("round_report_id").notNull().references(() => roundReportTable.id),
    description: varchar("description", { length: 225 }).notNull()
})


export const consverationReportTable = pgTable("ConversationReport", {
    id: serial('id').primaryKey(),
    residentId: integer().notNull().references(() => residentTable.id),
    zoneId: integer().notNull().references(() => zoneTable.id),
    submitted: date("submitted").notNull().defaultNow(),
    explanation: varchar({ length: 225 }).notNull(),
    level: levelEnum().notNull(),
    sentiment: sentimentEnum().notNull()
})

export const eventReportTable = pgTable('EventReport', {
    id: serial('id').primaryKey(),
    time: timestamp('time').notNull(),
    description: varchar('description', { length: 225 }).notNull(),
    attendance: integer().notNull(),
    zoneId: integer('zone_id').notNull().references(() => zoneTable.id)
})

export const zoneShiftTable = pgTable("ZoneShift", {
    id: serial('id').primaryKey(),
    zoneId: integer().references(() => zoneTable.id),
    start: date('start').notNull(),
    finish: date('finish').notNull()
})

export const staffShiftTable = pgTable("StaffShift", {
    id: serial('id').primaryKey(),
    staffId: integer().references(() => staffTable.id),
    start: date('start').notNull(),
    finish: date('finish').notNull()
})

export const RCITable = pgTable('RCI', {
    id: serial('id').primaryKey(),
    residentId: integer('resident_id').notNull().references(() => residentTable.id), // Assumes there's a Residents table
    submittedOn: date('submitted_on').defaultNow(),
    doorsLocks: varchar('doors_locks', { length: 225 }),
    emergencyItems: varchar('emergency_items', { length: 225 }),
    walls: varchar('walls', { length: 225 }),
    floor: varchar('floor', { length: 225 }),
    ceiling: varchar('ceiling', { length: 225 }),
    lightFixtures: varchar('light_fixtures', { length: 225 }),
    closetWardrobeMirror: varchar('closet_wardrobe_mirror', { length: 225 }),
    windowScreens: varchar('window_screens', { length: 225 }),
    curtainsRods: varchar('curtains_rods', { length: 225 }),
    deskChair: varchar('desk_chair', { length: 225 }),
    bedMattress: varchar('bed_mattress', { length: 225 }),
    dresser: varchar('dresser', { length: 225 }),
    bathroom: varchar('bathroom', { length: 225 }),
    towelBarRings: varchar('towel_bar_rings', { length: 225 }),
    status: statusEnum(),
    signedOn: date('signed_on')
});

// Define the ColonialRCI table
export const colonialRCITable = pgTable('ColonialRCI', {
    id: serial('id').primaryKey(),
    residentId: integer('resident_id').notNull().references(() => residentTable.id), // Assumes there's a Residents table
    submittedOn: date('submitted_on').defaultNow(),
    entryDoor: varchar('entry_door', { length: 225 }),
    stoveOven: varchar('stove_oven', { length: 225 }),
    countertops: varchar('countertops', { length: 225 }),
    cabinets: varchar('cabinets', { length: 225 }),
    refrigerator: varchar('refrigerator', { length: 225 }),
    washerDryer: varchar('washer_dryer', { length: 225 }),
    dishwasher: varchar('dishwasher', { length: 225 }),
    wallsCeilingDining: varchar('walls_ceiling_dining', { length: 225 }),
    sinkDisposal: varchar('sink_disposal', { length: 225 }),
    fireExtinguisher: varchar('fire_extinguisher', { length: 225 }),
    table: varchar('table', { length: 225 }),
    chairs: varchar('chairs', { length: 225 }),
    floorLiving: varchar('floor_living', { length: 225 }),
    wallsCeilingLiving: varchar('walls_ceiling_living', { length: 225 }),
    sofaLiving: varchar('sofa_living', { length: 225 }),
    chairLiving: varchar('chair_living', { length: 225 }),
    sideTableLiving: varchar('side_table_living', { length: 225 }),
    tvStandLiving: varchar('tv_stand_living', { length: 225 }),
    windowsBlindsLiving: varchar('windows_blinds_living', { length: 225 }),
    hallwayWallsFloorBathroomAB: varchar('hallway_walls_floor_bathroomAB', {length: 225 }),
    entryDoorBathroomAB: varchar('entry_door_bathroomAB', { length: 225 }),
    floorBathroomAB: varchar('floor_bathroomAB', { length: 225 }),
    wallsCeilingBathroomAB: varchar('walls_ceiling_bathroomAB', { length: 225 }),
    sinkCounterBathroomAB: varchar('sink_counter_bathroomAB', { length: 225 }),
    mirrorBathroomAB: varchar('mirror_bathroomAB', { length: 225 }),
    cabinetsBathroomAB: varchar('cabinets_bathroomAB', { length: 225 }),
    showerBathroomAB: varchar('shower_bathroomAB', { length: 225 }),
    toiletBathroomAB: varchar('toilet_bathroomAB', { length: 225 }),
    hallwayWallsFloorBathroomCD: varchar('hallway_walls_floor_bathroomCD', { length: 225 }),
    entryDoorBathroomCD: varchar('entry_door_bathroomCD', { length: 225 }),
    floorBathroomCD: varchar('floor_bathroomCD', { length: 225 }),
    wallsCeilingBathroomCD: varchar('walls_ceiling_bathroomCD', { length: 225 }),
    sinkCounterBathroomCD: varchar('sink_counter_bathroomCD', { length: 225 }),
    mirrorBathroomCD: varchar('mirror_bathroomCD', { length: 225 }),
    cabinetsBathroomCD: varchar('cabinets_bathroomCD', { length: 225 }),
    showerBathroomCD: varchar('shower_bathroomCD', { length: 225 }),
    toiletBathroomCD: varchar('toilet_bathroomCD', { length: 225 }),
    entryDoorBedroomA: varchar('entry_door_bedroomA', { length: 225 }),
    floorBedroomA: varchar('floor_bedroomA', { length: 225 }),
    wallsCeilingBedroomA: varchar('walls_ceiling_bedroomA', { length: 225 }),
    closetMirrorBedroomA: varchar('closet_mirror_bedroomA', { length: 225 }),
    bedMattressBedroomA: varchar('bed_mattress_bedroomA', { length: 225 }),
    deskChairBedroomA: varchar('desk_chair_bedroomA', { length: 225 }),
    dresserBedroomA: varchar('dresser_bedroomA', { length: 225 }),
    entryDoorBedroomB: varchar('entry_door_bedroomB', { length: 225 }),
    floorBedroomB: varchar('floor_bedroomB', { length: 225 }),
    wallsCeilingBedroomB: varchar('walls_ceiling_bedroomB', { length: 225 }),
    closetMirrorBedroomB: varchar('closet_mirror_bedroomB', { length: 225 }),
    bedMattressBedroomB: varchar('bed_mattress_bedroomB', { length: 225 }),
    deskChairBedroomB: varchar('desk_chair_bedroomB', { length: 225 }),
    dresserBedroomB: varchar('dresser_bedroomB', { length: 225 }),
    entryDoorBedroomC: varchar('entry_door_bedroomC', { length: 225 }),
    floorBedroomC: varchar('floor_bedroomC', { length: 225 }),
    wallsCeilingBedroomC: varchar('walls_ceiling_bedroomC', { length: 225 }),
    closetMirrorBedroomC: varchar('closet_mirror_bedroomC', { length: 225 }),
    bedMattressBedroomC: varchar('bed_mattress_bedroomC', { length: 225 }),
    deskChairBedroomC: varchar('desk_chair_bedroomC', { length: 225 }),
    dresserBedroomC: varchar('dresser_bedroomC', { length: 225 }),
    entryDoorBedroomD: varchar('entry_door_bedroomD', { length: 225 }),
    floorBedroomD: varchar('floor_bedroomD', { length: 225 }),
    wallsCeilingBedroomD: varchar('walls_ceiling_bedroomD', { length: 225 }),
    closetMirrorBedroomD: varchar('closet_mirror_bedroomD', { length: 225 }),
    bedMattressBedroomD: varchar('bed_mattress_bedroomD', { length: 225 }),
    deskChairBedroomD: varchar('desk_chair_bedroomD', { length: 225 }),
    dresserBedroomD: varchar('dresser_bedroomD', { length: 225 }),
    status: statusEnum(),
    signedOn: date('signed_on')
});

