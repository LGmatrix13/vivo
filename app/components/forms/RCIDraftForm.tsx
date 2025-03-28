import Textarea from "../common/Textarea";
import { Form } from "@remix-run/react";
import AcknowledgeIssueRadio from "../common/AcknowledgeIssueRadio";
import WideButton from "../common/WideButton";

interface RCIDraftFormProps {
  roomId: number;
  mapping: Record<string, string>;
  issues: Record<string, string>;
}

export default function RCIDraftForm(props: RCIDraftFormProps) {
  const { mapping, issues, roomId } = props;

  return (
    <Form className="space-y-5" method="post">
      {roomId && (
        <input name="id" type="hidden" value={roomId} />
      )}
      <input
        name="roomId"
        type="hidden"
        value={roomId as number}
      />
      {Object.keys(mapping).map((key) => (
        <AcknowledgeIssueRadio
          title={mapping[key as keyof typeof mapping]}
          yes={issues && !!issues[key]}
        >
          <Textarea
            required
            label="Comments"
            name={key}
            placeholder={`Describe the issues with the ${mapping[key].toLowerCase()}`}
            defaultValue={issues ? issues[key] : ""}
          />
        </AcknowledgeIssueRadio>
      ))}
      <WideButton
        options={{
          type: "submit",
          name: "intent",
          value: "update",
        }}
      >
        Save RCI Draft
      </WideButton>
    </Form>
  );
}
