# Pi Make Core V1 - Project State Contract

The project state is the minimum persistent context needed for Make Agent to work on a live project.

## Required project.json

```json
{
  "version": "1.0",
  "name": "project-name",
  "root": ".",
  "mode": "create",
  "stack": "html-tailwind",
  "entrypoints": ["index.html"],
  "runtime": { "start": null, "ready": null, "ports": [] }
}
```

## Rules

- Keep the model small.
- Do not duplicate page content into project metadata.
- Do not encode visual decisions that can be read from the actual project.
- Runtime commands belong to the project adapter/runtime, not to a design agent.
- Existing projects may omit fields that are not applicable; adapters resolve missing runtime details.

## Ephemeral run state

Process/session id, preview URL, browser target, screenshot paths, console errors, network errors, last successful build, last edit, and observation history are runtime state, not source-of-truth project data.
