import { EmailButton } from "./EmailButton";
import { IRDOnDuty } from "~/models/shifts";
import { PhoneButton } from "./PhoneButton";

interface RDOnDutyProps {
  rdOnDuty: IRDOnDuty;
}

export default function RDOnDuty(props: RDOnDutyProps) {
  const { rdOnDuty } = props;
  const { name, building, email } = rdOnDuty;
  return (
    <div className="border border-gray-300 rounded-lg divide-y divide-gray-300">
      <div className="p-5 space-x-5 flex items-center">
        <img
          src={`/avatars/rd/${rdOnDuty.staffId}`}
          alt={`${name}'s profile picture`}
          className="w-14 h-14 rounded-full"
        />
        <div className="space-y-3">
          <div className="flex flex-col space-y-1">
            <h2 className="font-bold">{name}</h2>
            <p>{building}</p>
          </div>
          <div className="space-x-2 flex">
            <EmailButton email={email}></EmailButton>
            <PhoneButton phoneNumber={"7249672120"}>RD On Call</PhoneButton>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 text-sm">On duty till 11:59 PM</div>
    </div>
  );
}
