import { IUpperRCI } from "~/models/reports";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import { useState } from "react";
import { Form } from "@remix-run/react";
import CollaspableContent from "../common/CollaspableContent";

interface RCIFormProps {
  roomId: number;
}

interface AcknowledgeProblemFieldProps {
  title: string;
  children: React.ReactElement;
}

function AcknowledgeProblemField(props: AcknowledgeProblemFieldProps) {
  const [hasProblem, setHasProblem] = useState<boolean>();

  return (
    <div className="space-y-3">
      <label className="font-bold">
        {props.title} <span className="text-red-600">*</span>
      </label>
      <div className="space-y-3 flex flex-col">
        <div className="flex space-x-3">
          <div className="space-x-2">
            <input
              type="radio"
              id="yes"
              name={"condition" + props.title}
              value={hasProblem ? "yes" : "no"}
              onClick={() => setHasProblem(true)}
              readOnly
            />
            <label htmlFor="yes">Issues</label>
          </div>
          <div className="space-x-2">
            <input
              type="radio"
              id="no"
              name={"condition" + props.title}
              value={hasProblem ? "yes" : "no"}
              onClick={() => setHasProblem(false)}
              readOnly
              required
            />
            <label htmlFor="no">No Issues</label>
          </div>
        </div>

        {hasProblem && props.children}
      </div>
    </div>
  );
}

export default function RCIForm(props: RCIFormProps) {
  const { roomId } = props;
  return (
    <Form className="space-y-5 flex flex-col">
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
      <CollaspableContent title="Entry/Kitchen/Dining">
        <AcknowledgeProblemField title={"Entry Door"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Entry Door"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Floor"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Stove/Oven"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Stove/Oven"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Countertops"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Countertops"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Cabinets"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Cabinets"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Refrigerator"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Refrigerator"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Washer/Dryer"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Washer/Dryer"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Dishwasher"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Dishwasher"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Sink/Disposal"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Sink/Disposal"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Fire Extinguisher"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Fire Extinguisher"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Table"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Table"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Chairs"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Chairs"
          />
        </AcknowledgeProblemField>
      </CollaspableContent>
      <CollaspableContent title="Living Room" collasped>
        <AcknowledgeProblemField title={"Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Floor"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Sofa"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Sofa"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Chair"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Chair"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Side Table"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Side Table"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"TV Stand"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the TV Stand"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Windows/Blinds"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Windows/Blinds"
          />
        </AcknowledgeProblemField>
      </CollaspableContent>
      <CollaspableContent title="Bathroom - A/B Side" collasped>
        <AcknowledgeProblemField title={"Hallway Walls/Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Hallway Walls/Floor"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Entry Door"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Entry Door"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Bathroom Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Bathroom Floor"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Sink/Counter"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Sink/Counter"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Mirror"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Mirror"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Cabinets"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Cabinets"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Shower/Curtain/Rings"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Shower/Curtain/Rings"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Toilet"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Toilet"
          />
        </AcknowledgeProblemField>
      </CollaspableContent>
      <CollaspableContent title="Bathroom - C/D Side" collasped>
        <AcknowledgeProblemField title={"Hallway Walls/Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Hallway Walls/Floor"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Entry Door"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Entry Door"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Bathroom Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Bathroom Floor"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Sink/Counter"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Sink/Counter"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Mirror"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Mirror"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Cabinets"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Cabinets"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Shower/Curtain/Rings"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Shower/Curtain/Rings"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Toilet"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Toilet"
          />
        </AcknowledgeProblemField>
      </CollaspableContent>
      <CollaspableContent title="Bedroom A" collasped>
        <AcknowledgeProblemField title={"Entry Door"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Entry Door"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Floor"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Closet/Mirror"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Closet/Mirror"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Bed/Mattress"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Bed/Mattress"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Desk/Chair"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Desk/Chair"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Dresser"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Dresser"
          />
        </AcknowledgeProblemField>
      </CollaspableContent>
      <CollaspableContent title="Bedroom B" collasped>
        <AcknowledgeProblemField title={"Entry Door"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Entry Door"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Floor"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Closet/Mirror"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Closet/Mirror"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Bed/Mattress"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Bed/Mattress"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Desk/Chair"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Desk/Chair"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Dresser"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Dresser"
          />
        </AcknowledgeProblemField>
      </CollaspableContent>
      <CollaspableContent title="Bedroom C" collasped>
        <AcknowledgeProblemField title={"Entry Door"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Entry Door"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Floor"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Closet/Mirror"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Closet/Mirror"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Bed/Mattress"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Bed/Mattress"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Desk/Chair"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Desk/Chair"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Dresser"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Dresser"
          />
        </AcknowledgeProblemField>
      </CollaspableContent>
      <CollaspableContent title="Bedroom D" collasped>
        <AcknowledgeProblemField title={"Entry Door"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Entry Door"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Floor"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Walls/Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Walls/Ceiling"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Closet/Mirror"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Closet/Mirror"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Bed/Mattress"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Bed/Mattress"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Desk/Chair"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Desk/Chair"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Dresser"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the Dresser"
          />
        </AcknowledgeProblemField>
      </CollaspableContent>
      <Input
        label="Student Signature"
        placeholder="Signature"
        name="studentName"
        type="text"
        required
      />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </Form>
  );
}
