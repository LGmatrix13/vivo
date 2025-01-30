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
    const [formData, setFormData] = useState({
        time: round?.time || "",
        description: round?.description || "",
        violation: round?.violation || "",
        facilityConcerns: round?.facilityConcerns || "",
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
            <h2 className="font-bold text-xl">
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
            <Input
                label="Violations"
                name="violation"
                value={formData.violation}
                placeholder="Explain any violations you saw"
                type=""
            />
            <Input
                label="Facility Concerns / Maintenance Requests"
                name="facilityConcerns"
                value={formData.facilityConcerns}
                placeholder="Explain any facility concerns or maintenace requests"
                type=""
            />                
        </Form>
    );
}