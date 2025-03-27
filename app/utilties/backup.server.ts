import "dotenv/config";
import { spawn } from "child_process";

async function _export() {
  const cmd =
    "docker exec postgres_container pg_dump -U myuser -F c -b -v -f /tmp/backup.vivo mydatabase";
  const child = spawn(cmd);
  child.on("message", (message) => {
    console.log(message);
    const cmd =
      "docker cp postgres_container:/tmp/backup.dump ./source/app/public/backup.vivo";
    const child = spawn(cmd);
    child.on("message", () => {
      return true;
    });
  });

  return false;
}

export const backup = {
  export: _export,
};
