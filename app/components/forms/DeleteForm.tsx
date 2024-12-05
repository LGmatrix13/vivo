import Form from "../common/Form";
import Input from "../common/Input";
import WideButton from "../common/WideButton";

interface DeleteFormProps {
  id: number;
  title: string;
  toast?: string;
}

export default function DeleteForm(props: DeleteFormProps) {
  const { id, title, toast } = props;
  return (
    <Form toast={toast} button="Confirm">
      <h2 className="font-bold text-xl">{title}</h2>
      <p>Are you sure you want to delete {title}?</p>
      <input type="hidden" name="id" value={id} />
    </Form>
  );
}
