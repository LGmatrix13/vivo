import AcknowledgeIssueRadio from "../common/AcknowledgeIssueRadio";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import { Form } from "@remix-run/react";
import WideButton from "../common/WideButton";

interface UpperCampusRCIFormProps {
  roomId: number;
}

export default function UpperCampusRCIForm(props: UpperCampusRCIFormProps) {
  const { roomId } = props;
  return (
    <Form className="space-y-5">
      <input name="roomId" type="hidden" value={roomId} />
      <AcknowledgeIssueRadio title={"Doors and Locks"}>
        <Textarea
          required
          label="Comments"
          name="doorsLocks"
          placeholder="Describe the issues with the doors and locks"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Emergency Items"}>
        <Textarea
          required
          label="Comments"
          name="emergencyItems"
          placeholder="Describe the issues with the emergency items"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Walls"}>
        <Textarea
          required
          label="Comments"
          name="walls"
          placeholder="Describe the issues with the walls"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Floor"}>
        <Textarea
          required
          label="Comments"
          name="floor"
          placeholder="Describe the issues with the floor"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Ceiling"}>
        <Textarea
          required
          label="Comments"
          name="ceiling"
          placeholder="Describe the issues with the ceiling"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Lights, Lighting Fixtures"}>
        <Textarea
          required
          label="Comments"
          name="lightsFixtures"
          placeholder="Describe the issues with the lights and lighting fixtures"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Chest, Wardrobe, Mirror"}>
        <Textarea
          required
          label="Comments"
          name="closetWardrobeMirror"
          placeholder="Describe the issues with the chest, wardrobe, and mirror"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Windows, Screens"}>
        <Textarea
          required
          label="Comments"
          name="windowsScreens"
          placeholder="Describe the issues with the windows and screens"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Curtains, Rods"}>
        <Textarea
          required
          label="Comments"
          name="curtainsRods"
          placeholder="Describe the issues with the curtains and rods"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Desk, Chair"}>
        <Textarea
          required
          label="Comments"
          name="deskChair"
          placeholder="Describe the issues with the desk and chair"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Bed, Mattress"}>
        <Textarea
          required
          label="Comments"
          name="bedMattress"
          placeholder="Describe the issues with the bed and mattress"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Dresser"}>
        <Textarea
          required
          label="Comments"
          name="dresser"
          placeholder="Describe the issues with the dresser"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Bathroom"}>
        <Textarea
          required
          label="Comments"
          name="bathroom"
          placeholder="Describe the issues with the bathroom"
        />
      </AcknowledgeIssueRadio>
      <AcknowledgeIssueRadio title={"Towel Bar and Rings"}>
        <Textarea
          required
          label="Comments"
          name="towelbarRings"
          placeholder="Describe the issues with the towel bar and rings"
        />
      </AcknowledgeIssueRadio>
      <Input
        label="Student Signature"
        placeholder="Signature"
        name="studentSignature"
        type="text"
        required
      />
      <WideButton
        options={{
          type: "submit",
          intent: "create.upperCampus",
        }}
      >
        Submit Check-in Form
      </WideButton>
    </Form>
  );
}
