import { useState } from "react";

interface AcknowledgeIssueRadioProps {
  title: string;
  children: React.ReactElement;
  yes?: boolean;
}

/**
 * a toggle on/off for a part of an RCI
 */
export default function AcknowledgeIssueRadio(
  props: AcknowledgeIssueRadioProps
) {
  const [hasProblem, setHasProblem] = useState<boolean | undefined>(props.yes);

  return (
    <div className="space-y-3">
      <label className="font-bold">
        {props.title} <span className="text-red-600">*</span>
      </label>
      <div className="space-y-3 flex flex-col">
        <div className="flex space-x-3 accent-blue-600">
          <div className="space-x-2">
            <input
              type="radio"
              id="yes"
              name={"condition" + props.title}
              value={hasProblem ? "yes" : "no"}
              checked={hasProblem}
              onClick={() => setHasProblem(true)}
              required
            />
            <label htmlFor="yes">Issues</label>
          </div>
          <div className="space-x-2">
            <input
              type="radio"
              id="no"
              name={"condition" + props.title}
              value={hasProblem ? "yes" : "no"}
              onClick={() => setHasProblem(false)}
              checked={hasProblem === false}
              required
            />
            <label htmlFor="no">No Issues</label>
          </div>
        </div>

        {hasProblem && props.children}
      </div>
    </div>
  );
}
