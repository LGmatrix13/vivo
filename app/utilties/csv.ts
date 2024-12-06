function download(data: Record<string, any>[], filename: string) {
  const headers = Object.keys(data[0]);
  const header = headers.join(",");
  const lines = data.map((row) => Object.values(row).join(","));
  const content = header + "\n" + lines.join("\n");
  const blob = new Blob([content], { type: "text/csv" });
  const blobUrl = URL.createObjectURL(blob);
  const tempLink = document.createElement("a");
  tempLink.href = blobUrl;
  tempLink.setAttribute("download", `${filename}.csv`);
  tempLink.click();
  URL.revokeObjectURL(blobUrl);
}

function parse<T>(content: string) {
  const lines = content.split("\n");
  const headers = lines[0].split(",").map((header) => header.trim());

  const jsonObjects = lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim());
    const jsonObject: Record<string, string> = {};
    headers.forEach((header, index) => {
      jsonObject[header] = values[index];
    });
    return jsonObject;
  });

  return jsonObjects as T;
}

export const csv = {
  parse,
  download,
};
