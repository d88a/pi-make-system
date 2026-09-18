import test from "node:test";
import assert from "node:assert/strict";
import { nextState, shouldEdit } from "../src/loop.mjs";
import { createProjectState, recordObservation, recordEdit } from "../src/state.mjs";

test("core loop reaches preview and edit", () => {
  let s = "UNDERSTAND";
  s = nextState(s, "understood");
  s = nextState(s, "built");
  s = nextState(s, "ready");
  s = nextState(s, "captured");
  s = nextState(s, "observed");
  s = nextState(s, "change");
  s = nextState(s, "edited");
  assert.equal(s, "RUN");
});

test("observation must contain a concrete problem and fix", () => {
  assert.equal(shouldEdit({ problem: "hero too weak", fix: "increase image dominance" }), true);
  assert.equal(shouldEdit({ problem: "hero looks weak" }), false);
});

test("run state records observations and edits", () => {
  const state = createProjectState({ name: "demo" });
  recordObservation(state, { problem: "low contrast", fix: "darken overlay" });
  recordEdit(state, { reason: "observation:1", files: ["index.html"] });
  assert.equal(state.run.observations.length, 1);
  assert.equal(state.run.edits.length, 1);
});
