export const STATES = Object.freeze([
  "UNDERSTAND",
  "BUILD",
  "RUN",
  "PREVIEW",
  "OBSERVE",
  "DECIDE",
  "EDIT",
  "VERIFY",
  "DONE",
  "FAIL"
]);

export function nextState(current, event) {
  const transitions = {
    UNDERSTAND: { understood: "BUILD" },
    BUILD: { built: "RUN" },
    RUN: { ready: "PREVIEW", error: "FAIL" },
    PREVIEW: { captured: "OBSERVE" },
    OBSERVE: { observed: "DECIDE", blocked: "FAIL" },
    DECIDE: { change: "EDIT", done: "VERIFY" },
    EDIT: { edited: "RUN", error: "FAIL" },
    VERIFY: { passed: "DONE", failed: "FAIL" }
  };
  return transitions[current]?.[event] ?? null;
}

export function shouldEdit(observation) {
  return Boolean(observation?.problem && observation?.fix);
}
