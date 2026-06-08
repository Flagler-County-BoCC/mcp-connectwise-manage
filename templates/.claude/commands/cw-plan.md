Show the mcp-forge rewrite plan for this project.

1. Look for an AUDIT_MANIFEST in the current conversation and extract the projectType field
2. If no manifest exists, ask the user to run /cw-audit first
3. Call the `list_steps` tool from mcp-forge with projectType: "mcp-server"
4. Display the full step list, clearly marking each step as APPLIES or SKIP
5. Recommend the next step to run
