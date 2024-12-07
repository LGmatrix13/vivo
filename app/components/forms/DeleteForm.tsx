import Form from "../common/Form";

interface DeleteFormProps {
  id: number;
  title: string;
  toast?: string;
}

export default function DeleteForm(props: DeleteFormProps) {
  const { id, title, toast } = props;
  const prompt = `Are you sure you want to ${title.charAt(0).toLowerCase() + title.slice(1)}?`
  return (
    <Form toast={toast} button="Confirm" intent="delete">
      <h2 className="font-bold text-xl">{title}</h2>
      <p>{prompt}</p>
      <input type="hidden" name="id" value={id} />
    </Form>
  );
}
