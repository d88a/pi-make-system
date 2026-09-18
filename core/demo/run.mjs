import { createProjectState, recordObservation, recordEdit } from "../src/state.mjs";
import { nextState } from "../src/loop.mjs";

let state = createProjectState({ name: "core-demo" });
let flow = "UNDERSTAND";
const events = ["understood", "built", "ready", "captured", "observed", "change", "edited"];
for (const event of events) flow = nextState(flow, event);

recordObservation(state, {
  problem: "Demo observation: the primary CTA is visually weak.",
  fix: "Increase CTA prominence without changing its text."
});
recordEdit(state, {
  reason: "observation:1",
  files: ["index.html"],
  summary: "CTA prominence increased."
});

console.log(JSON.stringify({ state, flow }, null, 2));
