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
    <div className="space-y-5">
      {originalKeys.map((originalKey, index) => (
        <div className="space-y-3 flex flex-col" key={index}>
          <h2 className="font-bold">{keys[originalKey]}</h2>
          <p>
            {row[originalKey] === null || row[originalKey] === undefined
              ? "-"
              : row[originalKey]}
          </p>
        </div>
      ))}
    </div>
  );
}
