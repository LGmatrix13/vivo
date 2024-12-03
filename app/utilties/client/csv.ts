export function csv(data: { [key: string]: any }[], filename: string) {
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
