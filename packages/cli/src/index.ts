#!/usr/bin/env node

import { pathToFileURL } from "node:url";

export function cliPackageReady() {
  return true;
}

export async function main() {
  console.log("LaunchKit CLI is not implemented yet.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
