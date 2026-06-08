Apply a specific mcp-forge rewrite step to this project.

Usage:
  /cw-step 2              — apply step 2
  /cw-step 8 mcp-server   — apply step 8 for mcp-server type

Arguments: $ARGUMENTS

1. Parse $ARGUMENTS — first token is the step number, optional second token is the project type
2. If no step number is provided, tell the user the correct usage and stop
3. Call the `get_step` tool from mcp-forge with the parsed step number (and projectType: "mcp-server" for step 8)
4. Apply the returned prompt to the current codebase — write or rewrite files as instructed
5. Show a clear summary of every file created or modified
6. Suggest the next step: `/cw-step <n+1>`
