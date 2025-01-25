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
                    <label className="text-2xl font-bold">Entry/Kitchen/Dining</label>
                    <AcknowledgeProblemField title={"Entry Door"}>
                        <Textarea
                            required
                            label="Comments"
                            name="comments"
                            placeholder="Describe the issues with the Entry Door"
                        />
                    </AcknowledgeProblemField>
                    <AcknowledgeProblemField title={"Floor"}>
                        <Textarea
                            required
                            label="Comments"
                            name="comments"
                            placeholder="Describe the issues with the Floor"
                        />
                    </AcknowledgeProblemField>
                    <AcknowledgeProblemField title={"Stove/Oven"}>
                        <Textarea
                            required
                            label="Comments"
                            name="comments"
                            placeholder="Describe the issues with the Stove/Oven"
                        />
                    </AcknowledgeProblemField>
                    <AcknowledgeProblemField title={"Countertops"}>
                        <Textarea
                            required
                            label="Comments"
                            name="comments"
                            placeholder="Describe the issues with the Countertops"
                        />
                    </AcknowledgeProblemField>
                    <AcknowledgeProblemField title={"Cabinets"}>
                        <Textarea
                            required
                            label="Comments"
                            name="comments"
                            placeholder="Describe the issues with the Cabinets"
                        />
                    </AcknowledgeProblemField>
                    <AcknowledgeProblemField title={"Refrigerator"}>
                        <Textarea
                            required
                            label="Comments"
                            name="comments"
                            placeholder="Describe the issues with the Refrigerator"
                        />
                    </AcknowledgeProblemField>
                    <AcknowledgeProblemField title={"Washer/Dryer"}>
                        <Textarea
                            required
                            label="Comments"
                            name="comments"
                            placeholder="Describe the issues with the Washer/Dryer"
                        />
                    </AcknowledgeProblemField>
                    <AcknowledgeProblemField title={"Dishwasher"}>
                        <Textarea
                            required
                            label="Comments"
                            name="comments"
                            placeholder="Describe the issues with the Dishwasher"
                        />
                    </AcknowledgeProblemField>
                    <AcknowledgeProblemField title={"Walls/Ceiling"}>
                        <Textarea
                            required
                            label="Comments"
                            name="comments"
                            placeholder="Describe the issues with the Walls/Ceiling"
                        />
                    </AcknowledgeProblemField>
                    <AcknowledgeProblemField title={"Sink/Disposal"}>
                        <Textarea
                            required
                            label="Comments"
                            name="comments"
                            placeholder="Describe the issues with the Sink/Disposal"
                        />
                    </AcknowledgeProblemField>
                    <AcknowledgeProblemField title={"Fire Extinguisher"}>
                        <Textarea
                            required
                            label="Comments"
                            name="comments"
                            placeholder="Describe the issues with the Fire Extinguisher"
                        />
                    </AcknowledgeProblemField>
                    <AcknowledgeProblemField title={"Table"}>
                        <Textarea
                            required
                            label="Comments"
                            name="comments"
                            placeholder="Describe the issues with the Table"
                        />
                    </AcknowledgeProblemField>
                    <AcknowledgeProblemField title={"Chairs"}>
                        <Textarea
                            required
                            label="Comments"
                            name="comments"
                            placeholder="Describe the issues with the Chairs"
                        />
                    </AcknowledgeProblemField>

                <label className="text-2xl font-bold">Living Room</label>
                <AcknowledgeProblemField title={"Floor"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Floor"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Walls/Ceiling"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Walls/Ceiling"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Sofa"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Sofa"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Chair"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Chair"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Side Table"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Side Table"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"TV Stand"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the TV Stand"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Windows/Blinds"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Windows/Blinds"
                    />
                </AcknowledgeProblemField>

                <label className="text-2xl font-bold">Bathroom - A/B Side</label>
                <AcknowledgeProblemField title={"Hallway Walls/Floor"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Hallway Walls/Floor"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Entry Door"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Entry Door"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Bathroom Floor"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Bathroom Floor"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Walls/Ceiling"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Walls/Ceiling"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Sink/Counter"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Sink/Counter"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Mirror"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Mirror"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Cabinets"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Cabinets"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Shower/Curtain/Rings"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Shower/Curtain/Rings"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Toilet"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Toilet"
                    />
                </AcknowledgeProblemField>

                <label className="text-2xl font-bold">Bathroom - C/D Side</label>
                <AcknowledgeProblemField title={"Hallway Walls/Floor"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Hallway Walls/Floor"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Entry Door"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Entry Door"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Bathroom Floor"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Bathroom Floor"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Walls/Ceiling"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Walls/Ceiling"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Sink/Counter"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Sink/Counter"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Mirror"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Mirror"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Cabinets"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Cabinets"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Shower/Curtain/Rings"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Shower/Curtain/Rings"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Toilet"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Toilet"
                    />
                </AcknowledgeProblemField>
                <label className="text-2xl font-bold">Bedroom A</label>
                <AcknowledgeProblemField title={"Entry Door"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Entry Door"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Floor"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Floor"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Walls/Ceiling"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Walls/Ceiling"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Closet/Mirror"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Closet/Mirror"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Bed/Mattress"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Bed/Mattress"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Desk/Chair"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Desk/Chair"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Dresser"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Dresser"
                    />
                </AcknowledgeProblemField>

                <label className="text-2xl font-bold">Bedroom B</label>
                <AcknowledgeProblemField title={"Entry Door"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Entry Door"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Floor"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Floor"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Walls/Ceiling"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Walls/Ceiling"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Closet/Mirror"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Closet/Mirror"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Bed/Mattress"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Bed/Mattress"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Desk/Chair"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Desk/Chair"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Dresser"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Dresser"
                    />
                </AcknowledgeProblemField>
                
                <label className="text-2xl font-bold">Bedroom C</label>
                <AcknowledgeProblemField title={"Entry Door"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Entry Door"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Floor"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Floor"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Walls/Ceiling"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Walls/Ceiling"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Closet/Mirror"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Closet/Mirror"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Bed/Mattress"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Bed/Mattress"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Desk/Chair"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Desk/Chair"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Dresser"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Dresser"
                    />
                </AcknowledgeProblemField>

                <label className="text-2xl font-bold">Bedroom D</label>
                <AcknowledgeProblemField title={"Entry Door"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Entry Door"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Floor"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Floor"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Walls/Ceiling"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Walls/Ceiling"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Closet/Mirror"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Closet/Mirror"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Bed/Mattress"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Bed/Mattress"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Desk/Chair"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Desk/Chair"
                    />
                </AcknowledgeProblemField>
                <AcknowledgeProblemField title={"Dresser"}>
                    <Textarea
                        required
                        label="Comments"
                        name="comments"
                        placeholder="Describe the issues with the Dresser"
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
