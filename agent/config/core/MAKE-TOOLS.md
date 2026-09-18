# Pi Make Core V1 - Tool Contract

Make Agent operates through a small semantic tool surface.

## project.inspect
Returns stack, entry points, relevant files, pages, assets, package/runtime information, and existing constraints.

## project.read
Reads source needed for the current task.

## project.edit
Applies a scoped source change. Input includes target files, intent, exact change, and preservation constraints.

## runtime.start
Starts the project using its adapter and returns process/session id, preview URL, and readiness state.

## runtime.stop
Stops the active project runtime.

## preview.open
Opens a rendered page at a specified route and viewport.

## preview.screenshot
Captures a rendered screenshot. Minimum viewports: desktop 1440 and mobile 390.

## preview.inspect
Inspects rendered DOM and computed styles for a selected target. This is objective evidence and does not replace visual observation.

## visual.observe
Provides the rendered screenshot to a vision-capable observer. The observer must distinguish visible evidence, uncertainty, and inference. If no reliable vision capability is available, status is BLOCKED rather than simulated.

## asset.find / asset.generate
Find or generate a required visual asset when permitted by the task.

## verify.run
Runs applicable deterministic checks.

## Capability selection
Make Agent may call these tools directly or delegate a narrow operation to a legacy capability. No capability is mandatory for every run.
