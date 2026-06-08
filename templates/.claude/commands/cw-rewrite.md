Run a complete single-pass enterprise rewrite of this mcp-server project using mcp-forge.

1. Run /cw-audit to get the AUDIT_MANIFEST (skip if already in context)
2. Run /cw-plan to confirm which steps apply
3. Apply each applicable step in order (1 through 14, skipping step 6)
4. After all steps complete, run `npm run typecheck` and `npm run lint` to verify
5. Report a summary of all files created or modified
