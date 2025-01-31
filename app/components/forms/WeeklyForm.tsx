import { IWeeklyReport } from "~/models/reports";
import Form from "../common/Form";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import AcknowledgeWorkOrderRadio from "../common/AcknowledgeWorkOrderRadio";
import { z } from "zod";
import Select from "../common/Select";

interface WeeklyFormProps {
  zoneId: number;
  weekly?: IWeeklyReport;
}

export default function WeeklyForm(props: WeeklyFormProps) {
  const { weekly, zoneId } = props;
  const ratingOptions = [
    {
      key: "Great",
      value: "GREAT",
    },
    {
      key: "Good",
      value: "GOOD",
    },
    {
      key: "Ok",
      value: "OK",
    },
    { key: "Rough", value: "ROUGH" },
    { key: "Really Rough", value: "REALLY_ROUGH" },
  ];

  return (
    <Form button="Save Weekly Report" intent={weekly ? "update" : "create"}>
      <h2 className="font-bold text-xl">
        {weekly ? `Edit Weekly` : "Add Weekly Report"}
      </h2>
      {weekly && <input name="id" type="hidden" value={weekly.id} />}
      <input name="zoneId" type="hidden" value={zoneId} />
      <Input
        label="Time"
        placeholder="Time"
        name="time"
        type="datetime-local"
        required
      />
      <Textarea
        label="Describe Social Events this Past Week"
        name="socialEvents"
      />
      <Textarea
        label="Social Events Plsanned this Coming Week"
        name="possibleSocialEvents"
      />
      <AcknowledgeWorkOrderRadio title="Are there any outstanding work orders?">
        <Textarea
          label="Explain"
          name="workOrderArea"
          placeholder="Explain"
          required
        />
      </AcknowledgeWorkOrderRadio>
      <Input
        label="Is there anything you would like to add to this week's staff meeting?"
        placeholder="Explain"
        name="staffMeetingSuggestions"
        type="string"
      />
      <Select
        label={"Self Assess RA Responsibilities"}
        name={"responsibilities"}
        options={ratingOptions}
      />
      <Select
        label={"Self Assess Academic Responsibilities"}
        name={"academics"}
        options={ratingOptions}
      />
      <Select
        label={"Self Assess Spiritual Health"}
        name={"spiritualHealth"}
        options={ratingOptions}
      />
      <Select
        label={"Self Assess Physical Health"}
        name={"physicalHealth"}
        options={ratingOptions}
      />
      <Select
        label={"Self Assess Mental Health"}
        name={"mentalHealth"}
        options={ratingOptions}
      />
      <Select
        label={"Self Assess Person Life"}
        name={"personalLife"}
        options={ratingOptions}
      />
      <Select
        label={"Self Assess Technology & Media"}
        name={"personalLife"}
        options={ratingOptions}
      />
      <Textarea
        label="Explain your choices above"
        name="choicesAbove"
        required
      />
      <Textarea
        label="List and Describe some goals to assist and improvement on the areas above"
        name="choicesAbove"
        type="string"
        required
      />
    </Form>
  );
}
