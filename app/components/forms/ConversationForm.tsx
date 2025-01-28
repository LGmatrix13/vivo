import { IConversationReport } from "~/models/reports";
import Form from "../common/Form";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Select from "../common/Select";
import { IRA } from "~/models/people";

interface ConversationFormProps {
  zoneId: number;
  conversation?: IConversationReport;
  residentsDropdown: IRA[];
}

export default function ConversationForm(props: ConversationFormProps) {
  const { conversation, zoneId, residentsDropdown } = props;
  const levelOptions = ["1", "2", "3"].map((option) => ({
    key: option,
    value: option,
  }));
  const residentOptions = residentsDropdown.map((option) => ({
    key: option.name,
    value: option.id,
  }));
  const sentimentOptions = [
    {
      key: "Neutral",
      value: "NEUTRAL",
    },
    {
      key: "Positive",
      value: "POSITIVE",
    },
    {
      key: "Negative",
      value: "NEGATIVE",
    },
  ];
  const highPriorityOptions = [
    {
      key: "Yes",
      value: true,
    },
    {
      key: "No",
      value: false,
    },
  ];

  return (
    <Form
      button="Save Conversation"
      intent={conversation ? "update" : "create"}
    >
      <h2 className="font-bold text-xl">
        {conversation
          ? `Edit Conversation: ${conversation.id}`
          : "Add Conversation"}
      </h2>
      {conversation && (
        <input name="id" type="hidden" value={conversation.id} />
      )}
      <input name="zoneId" type="hidden" value={zoneId} />
      <Select
        label="Resident Name"
        placeholder="Who was the conversation with..."
        name="residentId"
        options={residentOptions}
        defaultValue={conversation?.residentId}
        step=".01"
        required
      />
      <Select
        label="Depth Level"
        name="level"
        options={levelOptions}
        selected={conversation?.level || "1"}
        required
      />
      <Select
        label="Sentiment Level"
        name="sentiment"
        options={sentimentOptions}
        selected={conversation?.sentiment || "NEUTRAL"}
        required
      />
      <Textarea
        label="Explanation"
        name="explanation"
        type="string"
        defaultValue={conversation?.explanation}
        required
      />
      <Select
        label="High Priority"
        name="highPriority"
        options={highPriorityOptions}
        selected={conversation?.highPriority || false}
        required
      />
    </Form>
  );
}