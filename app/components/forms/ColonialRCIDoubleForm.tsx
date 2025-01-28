import Input from "../common/Input";
import Textarea from "../common/Textarea";
import { Form } from "@remix-run/react";
import AcknowledgeIssueRadio from "~/components/common/AcknowledgeIssueRadio";
import WideButton from "../common/WideButton";

interface ColonialRCIDoubleFormProps {
  roomId: number;
}

export default function ColonialRCIDoubleForm(
  props: ColonialRCIDoubleFormProps
) {
  const { roomId } = props;
  return (
    <Form className="space-y-5">
      <input name="roomId" type="hidden" value={roomId} />
      <label className="text-2xl font-bold">Foyer/Kitchen/Dining</label>
      <AcknowledgeIssueRadio title={"Foyer Kitchen Dining Entry Door"}>
        <Textarea
          required
          label="Comments"
          name="foyerKitchenDiningEntryDoor"
          placeholder="Describe the issues with the Entry Door"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="foyerKitchenDiningCeiling"
          placeholder="Describe the issues with the Ceiling"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Floor"}>
        <Textarea
          required
          label="Comments"
          name="foyerKitchenDiningFloor"
          placeholder="Describe the issues with the Floor"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Walls"}>
        <Textarea
          required
          label="Comments"
          name="foyerKitchenDiningWalls"
          placeholder="Describe the issues with the Walls"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Sink/Disposal"}>
        <Textarea
          required
          label="Comments"
          name="foyerKitchenDiningSinkDisposal"
          placeholder="Describe the issues with the Sink/Disposal"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Countertops"}>
        <Textarea
          required
          label="Comments"
          name="foyerKitchenDiningCountertops"
          placeholder="Describe the issues with the Countertops"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Dishwasher"}>
        <Textarea
          required
          label="Comments"
          name="foyerKitchenDiningDishwasher"
          placeholder="Describe the issues with the Dishwasher"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Washer/Dryer"}>
        <Textarea
          required
          label="Comments"
          name="foyerKitchenDiningWasherDryer"
          placeholder="Describe the issues with the Washer/Dryer"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Refrigerator"}>
        <Textarea
          required
          label="Comments"
          name="foyerKitchenDiningRefrigerator"
          placeholder="Describe the issues with the Refrigerator"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Stove/Oven"}>
        <Textarea
          required
          label="Comments"
          name="foyerKitchenDiningStoveOven"
          placeholder="Describe the issues with the Stove/Oven"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Wall Cabinets"}>
        <Textarea
          required
          label="Comments"
          name="foyerKitchenDiningWallCabinets"
          placeholder="Describe the issues with the Wall Cabinets"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Table"}>
        <Textarea
          required
          label="Comments"
          name="foyerKitchenDiningTable"
          placeholder="Describe the issues with the Table"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Chairs"}>
        <Textarea
          required
          label="Comments"
          name="foyerKitchenDiningChairs"
          placeholder="Describe the issues with the Chairs"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Fire Exstinguisher"}>
        <Textarea
          required
          label="Comments"
          name="foyerKitchenDiningFireExtinguisher"
          placeholder="Describe the issues with the Fire Exstinguisher"
        />
      </AcknowledgeIssueRadio>
      <label className="text-2xl font-bold">Living Room</label>
      <AcknowledgeIssueRadio title={"Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="livingRoomCeiling"
          placeholder="Describe the issues with the Ceiling"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Floor/Carpet"}>
        <Textarea
          required
          label="Comments"
          name="livingRoomFloorCarpet"
          placeholder="Describe the issues with the Floor/Carpet"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Walls"}>
        <Textarea
          required
          label="Comments"
          name="livingRoomWalls"
          placeholder="Describe the issues with the Walls"
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
      <AcknowledgeIssueRadio title={"Window/Blinds"}>
        <Textarea
          required
          label="Comments"
          name="livingRoomWindowBlinds"
          placeholder="Describe the issues with the Window/Blinds"
        />
      </AcknowledgeIssueRadio>
      <label className="text-2xl font-bold">Bathroom</label>
      <AcknowledgeIssueRadio title={"Entry Door"}>
        <Textarea
          required
          label="Comments"
          name="bathroomEntryDoor"
          placeholder="Describe the issues with the Entry Door"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="bathroomCeiling"
          placeholder="Describe the issues with the Ceiling"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Floor"}>
        <Textarea
          required
          label="Comments"
          name="bathroomFloor"
          placeholder="Describe the issues with the Floor"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Walls"}>
        <Textarea
          required
          label="Comments"
          name="bathroomWalls"
          placeholder="Describe the issues with the Walls"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Cabinet(s)"}>
        <Textarea
          required
          label="Comments"
          name="bathroomCabinet"
          placeholder="Describe the issues with the Cabinet(s)"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Mirror"}>
        <Textarea
          required
          label="Comments"
          name="bathroomMirror"
          placeholder="Describe the issues with the Mirror"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Sink/Counter"}>
        <Textarea
          required
          label="Comments"
          name="bathroomSinkCounter"
          placeholder="Describe the issues with the Sink/Counter"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Tub/Shower/Curtain"}>
        <Textarea
          required
          label="Comments"
          name="bathroomTubShowerCurtain"
          placeholder="Describe the issues with the Tub/Shower/Curtain"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Toilet"}>
        <Textarea
          required
          label="Comments"
          name="bathroomToilet"
          placeholder="Describe the issues with the Toilet"
        />
      </AcknowledgeIssueRadio>
      <label className="text-2xl font-bold">Bedroom - Left Side</label>
      <AcknowledgeIssueRadio title={"Entry Door"}>
        <Textarea
          required
          label="Comments"
          name="bedroomLeftEntryDoor"
          placeholder="Describe the issues with the Entry Door"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="bedroomLeftCeiling"
          placeholder="Describe the issues with the Ceiling"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Floor/Carpet"}>
        <Textarea
          required
          label="Comments"
          name="bedroomLeftFloorCarpet"
          placeholder="Describe the issues with the Floor/Carpet"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Walls"}>
        <Textarea
          required
          label="Comments"
          name="bedroomLeftWalls"
          placeholder="Describe the issues with the Walls"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Bed/Mattress"}>
        <Textarea
          required
          label="Comments"
          name="bedroomLeftBedMattress"
          placeholder="Describe the issues with the Bed/Mattress"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Closet/Mirror"}>
        <Textarea
          required
          label="Comments"
          name="bedroomLeftClosetMirror"
          placeholder="Describe the issues with the Closet/Mirror"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Desk/Chair"}>
        <Textarea
          required
          label="Comments"
          name="bedroomLeftDeskChair"
          placeholder="Describe the issues with the Desk/Chair"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Dresser"}>
        <Textarea
          required
          label="Comments"
          name="bedroomLeftDresser"
          placeholder="Describe the issues with the Dresser"
        />
      </AcknowledgeIssueRadio>
      <label className="text-2xl font-bold">Bedroom - Right Side</label>
      <AcknowledgeIssueRadio title={"Entry Door"}>
        <Textarea
          required
          label="Comments"
          name="bedroomRightEntryDoor"
          placeholder="Describe the issues with the Entry Door"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="bedroomRightCeiling"
          placeholder="Describe the issues with the Ceiling"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Floor/Carpet"}>
        <Textarea
          required
          label="Comments"
          name="bedroomRightFloorCarpet"
          placeholder="Describe the issues with the Floor/Carpet"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Walls"}>
        <Textarea
          required
          label="Comments"
          name="bedroomRightWalls"
          placeholder="Describe the issues with the Walls"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Bed/Mattress"}>
        <Textarea
          required
          label="Comments"
          name="bedroomRightBedMattress"
          placeholder="Describe the issues with the Bed/Mattress"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Closet/Mirror"}>
        <Textarea
          required
          label="Comments"
          name="bedroomRightClosetMirror"
          placeholder="Describe the issues with the Closet/Mirror"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Desk/Chair"}>
        <Textarea
          required
          label="Comments"
          name="bedroomRightDeskChair"
          placeholder="Describe the issues with the Desk/Chair"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Dresser"}>
        <Textarea
          required
          label="Comments"
          name="bedroomRightDresser"
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
      <WideButton
        options={{
          type: "submit",
          intent: "create.colonialDouble",
        }}
      >
        Save Check-in Form
      </WideButton>
    </Form>
  );
}
