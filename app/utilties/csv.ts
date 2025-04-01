function download(
  data: Record<string, any>[],
  filename: string,
  columns: Record<string, string>
) {
  const headers = Object.values(columns);
  const header = headers.join(",");
  const lines = data.map((row) =>
    Object.keys(columns)
      .map((col) => `"${col in row ? row[col] : ""}"`)
      .join(",")
  );
  const content = header + "\n" + lines.join("\n");
  const blob = new Blob([content], { type: "text/csv" });
  const blobUrl = URL.createObjectURL(blob);
  const tempLink = document.createElement("a");
  tempLink.href = blobUrl;
  tempLink.setAttribute("download", `${filename}.csv`);
  tempLink.click();
  URL.revokeObjectURL(blobUrl);
}

function parse(content: string) {
  let lines = content.split("\n");

  if (lines[lines.length - 1] == "") {
    lines = lines.slice(0, lines.length - 1);
  }

  // Helper function to parse a CSV line while respecting quoted fields
  function parseLine(line: string): string[] {
    const values: string[] = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
        // Toggle insideQuotes flag when encountering unescaped double quotes
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        // Split on comma if not inside quotes
        values.push(current.trim());
        current = "";
      } else {
        // Add character to current field
        current += char;
      }
    }

    // Add the last field
    if (current !== "") {
      values.push(current.trim());
    }

    return values.map((value) =>
      value.startsWith('"') && value.endsWith('"')
        ? value.slice(1, -1).replace(/\\"/g, '"') // Remove quotes and unescape double quotes
        : value
    );
  }

  const headers = parseLine(lines[0]);

  const jsonObjects = lines.slice(1).map((line) => {
    const values = parseLine(line);
    const jsonObject: Record<string, string> = {};
    headers.forEach((header, index) => {
      jsonObject[header] = values[index] || ""; // Handle missing fields
    });
    return jsonObject;
  });

  return jsonObjects;
}

export const csv = {
  parse,
  download,
};
