export function createProjectState(input = {}) {
  return {
    version: "1.0",
    name: input.name ?? "pi-make-project",
    root: input.root ?? ".",
    mode: input.mode ?? "create",
    stack: input.stack ?? "html-tailwind",
    entrypoints: input.entrypoints ?? ["index.html"],
    runtime: { start: null, ready: null, ports: [], ...(input.runtime ?? {}) },
    run: {
      status: "idle",
      previewUrl: null,
      screenshots: [],
      observations: [],
      edits: [],
      errors: []
    }
  };
}

export function recordObservation(state, observation) {
  state.run.observations.push({
    id: state.run.observations.length + 1,
    ...observation
  });
  return state;
}

export function recordEdit(state, edit) {
  state.run.edits.push({
    id: state.run.edits.length + 1,
    ...edit
  });
  return state;
}
