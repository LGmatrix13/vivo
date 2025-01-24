import { IUpperRCI } from "~/models/reports";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import { useState } from "react";
import { Form } from "@remix-run/react";

interface RCIFormProps {
  roomId: number;
}

interface AcknowledgeProblemFieldProps {
  title: string; children: React.ReactElement;
}

function AcknowledgeProblemField(props: AcknowledgeProblemFieldProps) {
  const [hasProblem, setHasProblem] = useState<boolean>();

  return (
    <div>
    <label>{props.title}*</label>
    <div>
      <input
        type="radio"
        id="yes"
        name={"condition" + props.title}
        value={hasProblem ? "yes" : "no"}
        onClick={() => setHasProblem(true)}
        readOnly
        required
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
  )
}

export default function RCIForm(props: RCIFormProps) {
    const { roomId } = props;
    return (
    <Form>
        <h2 className="font-bold text-xl">
          Room Inspection Form
        </h2>
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
        <AcknowledgeProblemField title={"Doors and Locks"}>
          <Textarea
            required
            label="Comments"
            name="comments"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Emergency Items"}>
          <Textarea
            required
            label="Comments"
            name="comments"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Walls"}>
          <Textarea
            required
            label="Comments"
            name="comments"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Lights and Lighting Fixures"}>
          <Textarea
            required
            label="Comments"
            name="comments"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Chest, Wardrobe, Mirror"}>
          <Textarea
            required
            label="Comments"
            name="comments"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Window and Screens"}>
          <Textarea
            required
            label="Comments"
            name="comments"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Curtains and Rods"}>
          <Textarea
            required
            label="Comments"
            name="comments"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Desk and Chair"}>
          <Textarea
            required
            label="Comments"
            name="comments"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Bed and Mattress"}>
          <Textarea
            required
            label="Comments"
            name="comments"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Dresser"}>
          <Textarea
            required
            label="Comments"
            name="comments"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Bathroom"}>
          <Textarea
            required
            label="Comments"
            name="comments"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Towel Bar and Rings"}>
          <Textarea
            required
            label="Comments"
            name="comments"
          />
        </AcknowledgeProblemField>
        <Input
        label="Student Signature"
        placeholder="Student Signature"
        name="studentName"
        type="text"
        required
        />
      </Form>
      
    );
  }

