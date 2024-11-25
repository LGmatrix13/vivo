export function csv(data: { [key: string]: any }[], filename: string) {
  const headers = Object.keys(data[0]);
  const header = headers.join("|");
  const lines = data.map((row, index) => {
    if (index > 0) {
      return row.join("|");
    } else {
      return header;
    }
  });

  const content = lines.join("\n");
  const blob = new Blob([content], { type: "text/csv" });
  const blobUrl = URL.createObjectURL(blob);
  const tempLink = document.createElement("a");
  tempLink.href = blobUrl;
  tempLink.setAttribute("download", `${filename}.csv`);
  tempLink.click();
  URL.revokeObjectURL(blobUrl);
}
