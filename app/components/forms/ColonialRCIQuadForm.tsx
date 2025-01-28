import { IUpperRCI } from "~/models/reports";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import { useState } from "react";
import { Form } from "@remix-run/react";
import AcknowledgeIssueRadio from "../common/AcknowledgeIssueRadio";

interface ColonialRCIQuadFormProps {
  roomId: number;
  issues?: Record<string, string>;
}

export default function RCIForm(props: ColonialRCIQuadFormProps) {
  const { roomId, issues } = props;
  return (
    <Form>
      <h2 className="font-bold text-xl">Room Condition Inspection Form</h2>
      <input name="roomId" type="hidden" value={roomId} />
      <Input
        label="RA Name"
        placeholder="RA Name"
        name="RAName"
        type="text"
        readOnly
      />
      <Input
        label="Inspection Date"
        placeholder="Inspection Date"
        name="inspectionDate"
        type="date"
        readOnly
      />
      <label className="text-2xl font-bold">Entry/Kitchen/Dining</label>
      <AcknowledgeIssueRadio title={"Entry Door"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Entry Door"
          value={issues?.entryDoor}
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Floor"}>
        <Textarea
          required
          label="Comments"
          name="kitchenFloor"
          placeholder="Describe the issues with the Floor"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Stove/Oven"}>
        <Textarea
          required
          label="Comments"
          name="kitchenStoveOven"
          placeholder="Describe the issues with the Stove/Oven"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Countertops"}>
        <Textarea
          required
          label="Comments"
          name="kitchenCountertops"
          placeholder="Describe the issues with the Countertops"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Cabinets"}>
        <Textarea
          required
          label="Comments"
          name="kitchenCabinets"
          placeholder="Describe the issues with the Cabinets"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Refrigerator"}>
        <Textarea
          required
          label="Comments"
          name="kitchenRefrigerator"
          placeholder="Describe the issues with the Refrigerator"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Washer/Dryer"}>
        <Textarea
          required
          label="Comments"
          name="kitchenWasherDryer"
          placeholder="Describe the issues with the Washer/Dryer"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Dishwasher"}>
        <Textarea
          required
          label="Comments"
          name="kitchenDishwasher"
          placeholder="Describe the issues with the Dishwasher"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="kitchenWallsCeiling"
          placeholder="Describe the issues with the Walls/Ceiling"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Sink/Disposal"}>
        <Textarea
          required
          label="Comments"
          name="kitchenSinkDisposal"
          placeholder="Describe the issues with the Sink/Disposal"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Fire Extinguisher"}>
        <Textarea
          required
          label="Comments"
          name="kitchenFireExtinguisher"
          placeholder="Describe the issues with the Fire Extinguisher"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Table"}>
        <Textarea
          required
          label="Comments"
          name="kitchenTable"
          placeholder="Describe the issues with the Table"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Chairs"}>
        <Textarea
          required
          label="Comments"
          name="kitchenChairs"
          placeholder="Describe the issues with the Chairs"
        />
      </AcknowledgeIssueRadio>

      <label className="text-2xl font-bold">Living Room</label>
      <AcknowledgeIssueRadio title={"Floor"}>
        <Textarea
          required
          label="Comments"
          name="livingRoomFloor"
          placeholder="Describe the issues with the Floor"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="livingRoomWallsCeiling"
          placeholder="Describe the issues with the Walls/Ceiling"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Sofa"}>
        <Textarea
          required
          label="Comments"
          name="livingRoomSofa"
          placeholder="Describe the issues with the Sofa"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Chair"}>
        <Textarea
          required
          label="Comments"
          name="livingRoomChair"
          placeholder="Describe the issues with the Chair"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Side Table"}>
        <Textarea
          required
          label="Comments"
          name="livingRoomSideTable"
          placeholder="Describe the issues with the Side Table"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"TV Stand"}>
        <Textarea
          required
          label="Comments"
          name="livingRoomTVStand"
          placeholder="Describe the issues with the TV Stand"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Windows/Blinds"}>
        <Textarea
          required
          label="Comments"
          name="livingRoomWindowsBlinds"
          placeholder="Describe the issues with the Windows/Blinds"
        />
      </AcknowledgeIssueRadio>

      <label className="text-2xl font-bold">Bathroom - A/B Side</label>
      <AcknowledgeIssueRadio title={"Hallway Walls/Floor"}>
        <Textarea
          required
          label="Comments"
          name="bathroomABHallwayWallsFloor"
          placeholder="Describe the issues with the Hallway Walls/Floor"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Entry Door"}>
        <Textarea
          required
          label="Comments"
          name="bathroomABEntryDoor"
          placeholder="Describe the issues with the Entry Door"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Bathroom Floor"}>
        <Textarea
          required
          label="Comments"
          name="bathroomABFloor"
          placeholder="Describe the issues with the Bathroom Floor"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="bathroomABWallsCeiling"
          placeholder="Describe the issues with the Walls/Ceiling"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Sink/Counter"}>
        <Textarea
          required
          label="Comments"
          name="bathroomABSinkCounter"
          placeholder="Describe the issues with the Sink/Counter"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Mirror"}>
        <Textarea
          required
          label="Comments"
          name="bathroomABMirror"
          placeholder="Describe the issues with the Mirror"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Cabinets"}>
        <Textarea
          required
          label="Comments"
          name="bathroomABCabinets"
          placeholder="Describe the issues with the Cabinets"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Shower/Curtain/Rings"}>
        <Textarea
          required
          label="Comments"
          name="bathroomABShowerCurtainRings"
          placeholder="Describe the issues with the Shower/Curtain/Rings"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Toilet"}>
        <Textarea
          required
          label="Comments"
          name="bathroomABToilet"
          placeholder="Describe the issues with the Toilet"
        />
      </AcknowledgeIssueRadio>
      <label className="text-2xl font-bold">Bathroom - C/D Side</label>
      <AcknowledgeIssueRadio title={"Hallway Walls/Floor"}>
        <Textarea
          required
          label="Comments"
          name="bathroomCDHallwayWallsFloor"
          placeholder="Describe the issues with the Hallway Walls/Floor"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Entry Door"}>
        <Textarea
          required
          label="Comments"
          name="bathroomCDEntryDoor"
          placeholder="Describe the issues with the Entry Door"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Bathroom Floor"}>
        <Textarea
          required
          label="Comments"
          name="bathroomCDFloor"
          placeholder="Describe the issues with the Bathroom Floor"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="bathroomCDWallsCeiling"
          placeholder="Describe the issues with the Walls/Ceiling"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Sink/Counter"}>
        <Textarea
          required
          label="Comments"
          name="bathroomCDSinkCounter"
          placeholder="Describe the issues with the Sink/Counter"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Mirror"}>
        <Textarea
          required
          label="Comments"
          name="bathroomCDMirror"
          placeholder="Describe the issues with the Mirror"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Cabinets"}>
        <Textarea
          required
          label="Comments"
          name="bathroomCDCabinets"
          placeholder="Describe the issues with the Cabinets"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Shower/Curtain/Rings"}>
        <Textarea
          required
          label="Comments"
          name="bathroomCDShowerCurtainRings"
          placeholder="Describe the issues with the Shower/Curtain/Rings"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Toilet"}>
        <Textarea
          required
          label="Comments"
          name="bathroomCDToilet"
          placeholder="Describe the issues with the Toilet"
        />
      </AcknowledgeIssueRadio>
      <label className="text-2xl font-bold">Bedroom A</label>
      <AcknowledgeIssueRadio title={"Entry Door"}>
        <Textarea
          required
          label="Comments"
          name="bedroomAEntryDoor"
          placeholder="Describe the issues with the Entry Door"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Floor"}>
        <Textarea
          required
          label="Comments"
          name="bedroomAFloor"
          placeholder="Describe the issues with the Floor"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="bedroomAWallsCeiling"
          placeholder="Describe the issues with the Walls/Ceiling"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Closet/Mirror"}>
        <Textarea
          required
          label="Comments"
          name="bedroomAClosetMirror"
          placeholder="Describe the issues with the Closet/Mirror"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Bed/Mattress"}>
        <Textarea
          required
          label="Comments"
          name="bedroomABedMattress"
          placeholder="Describe the issues with the Bed/Mattress"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Desk/Chair"}>
        <Textarea
          required
          label="Comments"
          name="bedroomADeskChair"
          placeholder="Describe the issues with the Desk/Chair"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Dresser"}>
        <Textarea
          required
          label="Comments"
          name="bedroomADresser"
          placeholder="Describe the issues with the Dresser"
        />
      </AcknowledgeIssueRadio>

      <label className="text-2xl font-bold">Bedroom B</label>
      <AcknowledgeIssueRadio title={"Entry Door"}>
        <Textarea
          required
          label="Comments"
          name="bedroomBEntryDoor"
          placeholder="Describe the issues with the Entry Door"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Floor"}>
        <Textarea
          required
          label="Comments"
          name="bedroomBFloor"
          placeholder="Describe the issues with the Floor"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="bedroomBWallsCeiling"
          placeholder="Describe the issues with the Walls/Ceiling"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Closet/Mirror"}>
        <Textarea
          required
          label="Comments"
          name="bedroomBClosetMirror"
          placeholder="Describe the issues with the Closet/Mirror"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Bed/Mattress"}>
        <Textarea
          required
          label="Comments"
          name="bedroomBBedMattress"
          placeholder="Describe the issues with the Bed/Mattress"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Desk/Chair"}>
        <Textarea
          required
          label="Comments"
          name="bedroomBDeskChair"
          placeholder="Describe the issues with the Desk/Chair"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Dresser"}>
        <Textarea
          required
          label="Comments"
          name="bedroomBDresser"
          placeholder="Describe the issues with the Dresser"
        />
      </AcknowledgeIssueRadio>

      <label className="text-2xl font-bold">Bedroom C</label>
      <AcknowledgeIssueRadio title={"Entry Door"}>
        <Textarea
          required
          label="Comments"
          name="bedroomCEntryDoor"
          placeholder="Describe the issues with the Entry Door"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Floor"}>
        <Textarea
          required
          label="Comments"
          name="bedroomCFloor"
          placeholder="Describe the issues with the Floor"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="bedroomCWallsCeiling"
          placeholder="Describe the issues with the Walls/Ceiling"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Closet/Mirror"}>
        <Textarea
          required
          label="Comments"
          name="bedroomCClosetMirror"
          placeholder="Describe the issues with the Closet/Mirror"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Bed/Mattress"}>
        <Textarea
          required
          label="Comments"
          name="bedroomCBedMattress"
          placeholder="Describe the issues with the Bed/Mattress"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Desk/Chair"}>
        <Textarea
          required
          label="Comments"
          name="bedroomCDeskChair"
          placeholder="Describe the issues with the Desk/Chair"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Dresser"}>
        <Textarea
          required
          label="Comments"
          name="bedroomCDresser"
          placeholder="Describe the issues with the Dresser"
        />
      </AcknowledgeIssueRadio>

      <label className="text-2xl font-bold">Bedroom D</label>
      <AcknowledgeIssueRadio title={"Entry Door"}>
        <Textarea
          required
          label="Comments"
          name="bedroomDEntryDoor"
          placeholder="Describe the issues with the Entry Door"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Floor"}>
        <Textarea
          required
          label="Comments"
          name="bedroomDFloor"
          placeholder="Describe the issues with the Floor"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="bedroomDWallsCeiling"
          placeholder="Describe the issues with the Walls/Ceiling"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Closet/Mirror"}>
        <Textarea
          required
          label="Comments"
          name="bedroomDClosetMirror"
          placeholder="Describe the issues with the Closet/Mirror"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Bed/Mattress"}>
        <Textarea
          required
          label="Comments"
          name="bedroomDBedMattress"
          placeholder="Describe the issues with the Bed/Mattress"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Desk/Chair"}>
        <Textarea
          required
          label="Comments"
          name="bedroomDDeskChair"
          placeholder="Describe the issues with the Desk/Chair"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Dresser"}>
        <Textarea
          required
          label="Comments"
          name="bedroomDDresser"
          placeholder="Describe the issues with the Dresser"
        />
      </AcknowledgeIssueRadio>
      <Input
        label="Student Signature"
        placeholder="Signature"
        name="signature"
        type="text"
        required
      />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </Form>
  );
}
