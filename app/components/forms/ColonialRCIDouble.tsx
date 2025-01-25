import { IUpperRCI } from "~/models/reports";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import { useState } from "react";
import { Form } from "@remix-run/react";

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
    <div>
      <label>
        {props.title} <span className="text-red-600">*</span>
      </label>
      <div>
        <input
          type="radio"
          id="yes"
          name={"condition" + props.title}
          value={hasProblem ? "yes" : "no"}
          onClick={() => setHasProblem(true)}
          readOnly
        />
        <label htmlFor="yes">Issues</label>
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
        {hasProblem && props.children}
      </div>
    </div>
  );
}

export default function RCIForm(props: RCIFormProps) {
  const { roomId } = props;
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
      <label className="text-2xl font-bold">Foyer/Kitchen/Dining</label>
      <AcknowledgeProblemField title={"Entry Door"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Entry Door"
        />
      </AcknowledgeProblemField>
      <AcknowledgeProblemField title={"Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Ceiling"
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
      <AcknowledgeProblemField title={"Walls"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Walls"
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
      <AcknowledgeProblemField title={"Sink/Disposal"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Sink/Disposal"
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
      <AcknowledgeProblemField title={"Dishwasher"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Dishwasher"
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
      <AcknowledgeProblemField title={"Refrigerator"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Refrigerator"
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
      <AcknowledgeProblemField title={"Wall Cabinets"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Wall Cabinets"
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
      <AcknowledgeProblemField title={"Fire Exstinguisher"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Fire Exstinguisher"
        />
      </AcknowledgeProblemField>
      <label className="text-2xl font-bold">Living Room</label>
      <AcknowledgeProblemField title={"Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Ceiling"
        />
      </AcknowledgeProblemField>
      <AcknowledgeProblemField title={"Floor/Carpet"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Floor/Carpet"
        />
      </AcknowledgeProblemField>
      <AcknowledgeProblemField title={"Walls"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Walls"
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
      <AcknowledgeProblemField title={"Window/Blinds"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Window/Blinds"
        />
      </AcknowledgeProblemField>
      <label className="text-2xl font-bold">Bathroom</label>
      <AcknowledgeProblemField title={"Entry Door"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Entry Door"
        />
      </AcknowledgeProblemField>
      <AcknowledgeProblemField title={"Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Ceiling"
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
      <AcknowledgeProblemField title={"Walls"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Walls"
        />
      </AcknowledgeProblemField>
      <AcknowledgeProblemField title={"Cabinet(s)"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Cabinet(s)"
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
      <AcknowledgeProblemField title={"Sink/Counter"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Sink/Counter"
        />
      </AcknowledgeProblemField>
      <AcknowledgeProblemField title={"Tub/Shower/Curtain"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Tub/Shower/Curtain"
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
      <label className="text-2xl font-bold">Bedroom - Left Side</label>
      <AcknowledgeProblemField title={"Entry Door"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Entry Door"
        />
      </AcknowledgeProblemField>
      <AcknowledgeProblemField title={"Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Ceiling"
        />
      </AcknowledgeProblemField>
      <AcknowledgeProblemField title={"Floor/Carpet"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Floor/Carpet"
        />
      </AcknowledgeProblemField>
      <AcknowledgeProblemField title={"Walls"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Walls"
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
      <AcknowledgeProblemField title={"Closet/Mirror"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Closet/Mirror"
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
      <label className="text-2xl font-bold">Bedroom - Right Side</label>
      <AcknowledgeProblemField title={"Entry Door"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Entry Door"
        />
      </AcknowledgeProblemField>
      <AcknowledgeProblemField title={"Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Ceiling"
        />
      </AcknowledgeProblemField>
      <AcknowledgeProblemField title={"Floor/Carpet"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Floor/Carpet"
        />
      </AcknowledgeProblemField>
      <AcknowledgeProblemField title={"Walls"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Walls"
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
      <AcknowledgeProblemField title={"Closet/Mirror"}>
        <Textarea
          required
          label="Comments"
          name="comments"
          placeholder="Describe the issues with the Closet/Mirror"
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
