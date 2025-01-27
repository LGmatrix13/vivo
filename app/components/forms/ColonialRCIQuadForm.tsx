import Input from "../common/Input";
import Textarea from "../common/Textarea";
import { Form } from "@remix-run/react";
import CollaspableContent from "../common/CollaspableContent";
import AcknowledgeIssueRadio from "../common/AcknowledgeIssueRadio";
import WideButton from "../common/WideButton";

interface ColonialRCIQuadFormProps {
  roomId: number;
}

export default function ColonialRCIQuadForm(props: ColonialRCIQuadFormProps) {
  const { roomId } = props;
  return (
    <Form className="space-y-5 flex flex-col">
      <input name="roomId" type="hidden" value={roomId} />
      <CollaspableContent title="Entry/Kitchen/Dining">
        <AcknowledgeIssueRadio title={"Entry Door"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Entry Door"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Floor"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Stove/Oven"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Stove/Oven"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Countertops"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Countertops"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Cabinets"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Cabinets"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Refrigerator"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Refrigerator"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Washer/Dryer"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Washer/Dryer"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Dishwasher"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Dishwasher"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Sink/Disposal"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Sink/Disposal"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Fire Extinguisher"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Fire Extinguisher"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Table"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Table"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Chairs"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Chairs"
          />
        </AcknowledgeIssueRadio>
      </CollaspableContent>
      <CollaspableContent title="Living Room" collasped>
        <AcknowledgeIssueRadio title={"Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Floor"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Sofa"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Sofa"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Chair"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Chair"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Side Table"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Side Table"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"TV Stand"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the TV Stand"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Windows/Blinds"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Windows/Blinds"
          />
        </AcknowledgeIssueRadio>
      </CollaspableContent>
      <CollaspableContent title="Bathroom - A/B Side" collasped>
        <AcknowledgeIssueRadio title={"Hallway Walls/Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Hallway Walls/Floor"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Entry Door"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Entry Door"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Bathroom Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Bathroom Floor"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Sink/Counter"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Sink/Counter"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Mirror"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Mirror"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Cabinets"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Cabinets"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Shower/Curtain/Rings"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Shower/Curtain/Rings"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Toilet"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Toilet"
          />
        </AcknowledgeIssueRadio>
      </CollaspableContent>
      <CollaspableContent title="Bathroom - C/D Side" collasped>
        <AcknowledgeIssueRadio title={"Hallway Walls/Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Hallway Walls/Floor"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Entry Door"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Entry Door"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Bathroom Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Bathroom Floor"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Sink/Counter"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Sink/Counter"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Mirror"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Mirror"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Cabinets"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Cabinets"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Shower/Curtain/Rings"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Shower/Curtain/Rings"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Toilet"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Toilet"
          />
        </AcknowledgeIssueRadio>
      </CollaspableContent>
      <CollaspableContent title="Bedroom A" collasped>
        <AcknowledgeIssueRadio title={"Entry Door"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Entry Door"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Floor"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Closet/Mirror"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Closet/Mirror"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Bed/Mattress"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Bed/Mattress"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Desk/Chair"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Desk/Chair"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Dresser"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Dresser"
          />
        </AcknowledgeIssueRadio>
      </CollaspableContent>
      <CollaspableContent title="Bedroom B" collasped>
        <AcknowledgeIssueRadio title={"Entry Door"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Entry Door"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Floor"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Closet/Mirror"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Closet/Mirror"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Bed/Mattress"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Bed/Mattress"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Desk/Chair"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Desk/Chair"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Dresser"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Dresser"
          />
        </AcknowledgeIssueRadio>
      </CollaspableContent>
      <CollaspableContent title="Bedroom C" collasped>
        <AcknowledgeIssueRadio title={"Entry Door"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Entry Door"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Floor"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Closet/Mirror"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Closet/Mirror"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Bed/Mattress"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Bed/Mattress"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Desk/Chair"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Desk/Chair"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Dresser"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Dresser"
          />
        </AcknowledgeIssueRadio>
      </CollaspableContent>
      <CollaspableContent title="Bedroom D" collasped>
        <AcknowledgeIssueRadio title={"Entry Door"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Entry Door"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Floor"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Closet/Mirror"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Closet/Mirror"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Bed/Mattress"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Bed/Mattress"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Desk/Chair"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Desk/Chair"
          />
        </AcknowledgeIssueRadio>
        <AcknowledgeIssueRadio title={"Dresser"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Dresser"
          />
        </AcknowledgeIssueRadio>
      </CollaspableContent>
      <Input
        label="Student Signature"
        placeholder="Signature"
        name="studentName"
        type="text"
        required
      />
      <WideButton
        options={{
          intent: "create.colonialQuad",
          type: "submit",
        }}
      >
        Save Check-in Form
      </WideButton>
    </Form>
  );
}
