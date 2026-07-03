import JSZip from "jszip";
import { describe, expect, it } from "vitest";

import { createProjectZip } from "./create-project-zip";

describe("createProjectZip", () => {
  it("includes files under the top-level project folder", async () => {
    const zip = await loadZip(
      await createProjectZip({
        name: "my-app",
        packageManager: "npm",
        files: [
          {
            path: "package.json",
            contents: "{}\n",
            encoding: "utf8",
          },
          {
            path: "app/page.tsx",
            contents: "export default function Page() {}\n",
            encoding: "utf8",
          },
        ],
      }),
    );

    expect(Object.keys(zip.files)).toEqual(
      expect.arrayContaining([
        "my-app/package.json",
        "my-app/app/page.tsx",
      ]),
    );
    await expect(zip.file("my-app/package.json")?.async("text")).resolves.toBe(
      "{}\n",
    );
  });

  it("handles base64 file contents", async () => {
    const zip = await loadZip(
      await createProjectZip({
        name: "binary-demo",
        packageManager: "pnpm",
        files: [
          {
            path: "public/icon.bin",
            contents: "AQID",
            encoding: "base64",
          },
        ],
      }),
    );

    const bytes = await zip.file("binary-demo/public/icon.bin")?.async("uint8array");

    expect(Array.from(bytes ?? [])).toEqual([1, 2, 3]);
  });

  it("rejects unsafe paths", async () => {
    await expect(
      createProjectZip({
        name: "unsafe",
        packageManager: "npm",
        files: [
          {
            path: "../outside.txt",
            contents: "bad",
            encoding: "utf8",
          },
        ],
      }),
    ).rejects.toThrow("Unsafe zip path");
  });

  it("rejects generated src directory paths", async () => {
    await expect(
      createProjectZip({
        name: "unsafe",
        packageManager: "npm",
        files: [
          {
            path: "src/app/page.tsx",
            contents: "bad",
            encoding: "utf8",
          },
        ],
      }),
    ).rejects.toThrow("Unsafe zip path");
  });
});

async function loadZip(blob: Blob): Promise<JSZip> {
  return JSZip.loadAsync(await blob.arrayBuffer());
}
