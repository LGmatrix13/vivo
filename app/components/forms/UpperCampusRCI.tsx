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
        Room Condition Inspection Form
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
            placeholder="Describe the issues with the doors and locks"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Emergency Items"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the emergency items"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Walls"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the walls"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Floor"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the floor"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Ceiling"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the ceiling"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Lights, Lighting Fixures"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the lights and lighting fixtures"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Chest, Wardrobe, Mirror"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the chest, wardrobe, and mirror"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Windows, Screens"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the windows and screens"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Curtains, Rods"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the curtains and rods"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Desk, Chair"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the desk and chair"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Bed, Mattress"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the bed and mattress"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Dresser"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the dresser"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Bathroom"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the bathroom"
          />
        </AcknowledgeProblemField>
        <AcknowledgeProblemField title={"Towel Bar and Rings"}>
          <Textarea
            required
            label="Comments"
            name="comments"
            placeholder="Describe the issues with the towel bar and rings"
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

