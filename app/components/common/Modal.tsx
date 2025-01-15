import { Dispatch } from "react";
import { Close } from "./Icons";

interface ModalProps {
  state: boolean;
  setState: Dispatch<boolean>;
  children: React.ReactNode;
}

export default function Modal(props: ModalProps) {
  const { state, setState } = props;
  return (
    <>
      {state && (
        <div className="fixed pointer-events-auto bg-black/[.8] top-0 right-0 bottom-0 left-0 z-1 !m-0">
          <div className="bg-white rounded-lg mx-auto mt-10 p-7 space-y-5 flex flex-col animate-modal w-[700px]">
            <button className="flex ml-auto" onClick={() => setState(false)}>
              <Close />
            </button>
            <div className="space-y-5">{props.children}</div>
          </div>
        </div>
      )}
    </>
  );
}
