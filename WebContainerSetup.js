import { WebContainer } from "https://cdn.skypack.dev/@webcontainer/api";

export async function bootWebContainer() {
  const wc = await WebContainer.boot();
  return wc;
}