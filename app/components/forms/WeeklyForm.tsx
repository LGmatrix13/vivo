import { IWeeklyReport } from "~/models/reports";
import Form from "../common/Form";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import AcknowledgeWorkOrderRadio from "../common/AcknowledgeWorkOrderRadio";
import { z } from "zod";

interface WeeklyFormProps {
  zoneId: number;
  weekly?: IWeeklyReport;
}

export default function WeeklyForm(props: WeeklyFormProps) {
  const { weekly, zoneId } = props;
  const ratings = z.enum(["GREAT", "GOOD", "OK", "ROUGH", "REALLY_ROUGH"]);
  const ratingOptions = ratings.options.map((option) => (
    <option key={option} value={option}>
      {option}
    </option>
  ));


  return (
    <Form button="Save Weekly Report" intent={weekly ? "update" : "create"}>
      <h2 className="font-bold text-xl">
        {weekly ? `Edit Weekly Report: ${weekly.id}` : "Add Weekly Report"}
      </h2>
      {weekly && <input name="id" type="hidden" value={weekly.id} />}
      <input name="zoneId" type="hidden" value={zoneId} />
      <Input
        label="Time"
        placeholder="Time"
        name="time"
        type="datetime-local"
        defaultValue={weekly?.time || new Date().toISOString().slice(0, 16)}
        step=".01"
        required
      />
      <Input
        label="Social Events from this past week"
        placeholder="Describe any social events from this past week"
        name="socialEvents"
        type="string"
      />
      <Input
        label="Social Events I'd like to do this coming week"
        placeholder="Describe any social events you'd like to do this coming week"
        name="possibleSocialEvents"
        type="string"
      />
      <h3 className="font-bold text-lg">Business Items</h3>
      <AcknowledgeWorkOrderRadio
      title =  "Are there any outstanding work orders?"
      >
        <Textarea
        label = "Explain"
        name = 'workOrderArea'
        placeholder = "Explain"
        required
        />
      </AcknowledgeWorkOrderRadio>
      <Input
        label="Is there anything you would like to add to this week's staff meeting?"
        placeholder="Explain"
        name="staffMeetingSuggestions"
        type="string"
      />
      <h3 className="font-bold text-lg">Self Assessment</h3>
      <h3 className="font text-lg">Indicate how you are doing in the following areas:</h3>
      <label>
        RA Responsibilities
        <select name="raResponsibilities" required>
          {ratingOptions}
        </select>
      </label>
      <label>
        Academic Responsibilties
        <select name="academics" required>
          {ratingOptions}
        </select>
      </label>
      <label>
        Spiritual Health
        <select name="spiritualHealth" required>
          {ratingOptions}
        </select>
      </label>
      <label>
        Physical Health
        <select name="physicalHealth" required>
          {ratingOptions}
        </select>
      </label>
      <label>
        Mental Health
        <select name="mentalHealth" required>
          {ratingOptions}
        </select>
      </label>
      <label>
        Personal Life
        <select name="personalLife" required>
          {ratingOptions}
        </select>
      </label>
      <label>
        Relationship with Technology & Media
        <select name="technologyAndMedia" required>
          {ratingOptions}
        </select>
      </label>
      <Input
      label="Explain your choices above"
      name="choicesAbove"
      type="string"
      required
      />
      <Input
      label="List and Describe some goals to assist and improvement on the areas above"
      name="choicesAbove"
      type="string"
      required
      />
    </Form>
  );
}
