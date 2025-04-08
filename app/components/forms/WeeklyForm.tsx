import { IWeeklyReport } from "~/models/reports";
import Form from "../common/Form";
import Textarea from "../common/Textarea";
import { z } from "zod";
import Select from "../common/Select";

interface WeeklyFormProps {
  zoneId: number;
  weekly?: IWeeklyReport;
  action?: string;
}

/**
 * form to create/modify a weekly report
 */
export default function WeeklyForm(props: WeeklyFormProps) {
  const { weekly, zoneId, action } = props;
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
    <Form
      button="Save Weekly Report"
      intent={weekly ? "update" : "create"}
      action={action}
    >
      <h2 className="font-bold text-xl">
        {weekly ? `Edit Weekly` : "Add Weekly Report"}
      </h2>
      {weekly && <input name="id" type="hidden" value={weekly.id} />}
      <input name="zoneId" type="hidden" value={zoneId} />
      <Textarea
        label="Is there anything you would like to add to this week's staff meeting?"
        placeholder="Explain"
        name="staffMeetingSuggestions"
      />
      <Select
        label={"Self Assess RA Responsibilities"}
        name={"raResponsibilities"}
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
        name={"technologyAndMedia"}
        options={ratingOptions}
      />
      <Textarea label="Explain your choices above" name="explainChoices" />
    </Form>
  );
}
