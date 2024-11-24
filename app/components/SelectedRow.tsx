interface SelectedRowProps {
  row: {
    [key: string]: any;
  };
  keys: {
    [translation: string]: string;
  };
}

export default function SelectedRow(props: SelectedRowProps) {
  const { row, keys } = props;
  const originalKeys = Object.keys(keys);
  return (
    <div className="space-y-3">
      {originalKeys.map((originalKey) => (
        <div className="space-y-2 flex flex-col">
          <h2 className="font-bold">{keys[originalKey]}</h2>
          <p>{row[originalKey]}</p>
        </div>
      ))}
    </div>
  );
}
