// TODO: Finish form
import { Form, useSubmit } from "@remix-run/react";
import Input from "../common/Input";
import WideButton from "../common/WideButton";
import { useDrawerContext } from "../common/Drawer";
import { useToastContext } from "../common/Toast";

export default function AddRoom() {
   // TODO: Use select instead of an input for staff id
   const [, setOpen] = useDrawerContext();
   const toast = useToastContext();
   const submit = useSubmit();
   return (
     <Form
       method="post"
       className="space-y-5"
       onSubmit={(event) => {
         setOpen(false);
         toast.success("Room Added");
         submit(event.currentTarget);
       }}
     >
       <h2 className="text-xl font-bold">Add a Room</h2>
       <Input label="Room Number" name="roomNumber" type="text" required />
       <Input label="Building ID" name="buildingId" type="number" required />
       <Input label="Zone ID" name="zoneId" type="number" required />
       <Input label="Capacity" name="capacity" type="number" required />
       <WideButton
         options={{
           type: "submit",
           name: "intent",
           value: "create",
         }}
       >
         Save Room
       </WideButton>
     </Form>
   );
}
