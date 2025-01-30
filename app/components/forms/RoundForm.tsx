import { IConversationReport, IRoundReport } from "~/models/reports";
import Form from "../common/Form";
import Textarea from "../common/Textarea";
import Input from "../common/Input";
import { Round } from "~/schemas/reports/round";
import { useState } from "react";

interface ConversationFormProps {
    zoneId: number;
    round?: IRoundReport;
}

export default function RoundForm(props: ConversationFormProps) {
    const { round, zoneId } = props;
    const [extraTextareasViolations, setExtraTextareasViolations] = useState<string[]>([]);
    const [extraTextareasFacility, setExtraTextareasFacility] = useState<string[]>([]);

    const addTextareaViolations = () => {
        setExtraTextareasViolations([...extraTextareasViolations, ""]);
    };

    const addTextareaFacility = () => {
        setExtraTextareasFacility([...extraTextareasFacility, ""]);
    };

    const [formData, setFormData] = useState({
        time: round?.time || "",
        description: round?.description || "",
        violations: extraTextareasViolations,
        facilityConcerns: extraTextareasFacility,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <Form button="Save Round Report" intent={round ? "update" : "create"}>
            <h2>
            {round ? `Edit Round Report: ${round.id}` : "Add Round"}
            </h2>
            {round && <input name="id" type="hidden" value={round.id} />}
            <input name="zoneId" type="hidden" value={zoneId} />
            <Input
                label="Time"
                placeholder="Time"
                name="time"
                type="datetime-local"
                defaultValue={round?.time || new Date().toISOString().slice(0, 16).replace(/:00$/, '')}
                step=".01"
                required
            />
            <Input
                label="Round Description"
                name="description"
                value={formData.description}
                placeholder="What did you see? Who did you talk to?"
                onChange={handleInputChange}
                required
                type=""
            />
            <h3 className="font-bold text-lg">Violations</h3>
            <button type="button" onClick={addTextareaViolations}>
                Add Violation
            </button>
            {extraTextareasViolations.map((_, index) => (
                <Input
                    key={index}
                    name={`violations[${index}]`}
                    value={formData.violations[index]}
                    onChange={handleInputChange}
                    label={`Violation ${index + 1}`}
                    placeholder="Describe the violation"
                    required type={""}                />
            ))}
            <h3 className="font-bold text-lg">Facility Concerns / Maintenance Requests</h3>
            <button type="button" onClick={addTextareaFacility}>
                Add Facility Concerns
            </button>
            {extraTextareasFacility.map((_, index) => (
                <Input
                    key={index}
                    name={`facilityConcerns[${index}]`}
                    value={formData.facilityConcerns[index]}
                    onChange={handleInputChange}
                    label={`Facility Concern ${index + 1}`}
                    placeholder="Describe the facility concern"
                    required type={""}                />
            ))}
        </Form>
    );
}