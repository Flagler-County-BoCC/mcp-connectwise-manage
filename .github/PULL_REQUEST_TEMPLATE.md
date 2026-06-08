## Summary

<!-- What does this PR do? One paragraph. -->

## Type of change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing behavior to change)
- [ ] Documentation update
- [ ] Dependency update
- [ ] Refactor (no functional changes)

## Related issues

<!-- Fixes #NNN or Closes #NNN -->

## Changes

<!-- Bullet list of specific files/areas changed and why. -->

## Testing

- [ ] Existing tests pass (`npm test`)
- [ ] New tests added for new functionality
- [ ] Coverage does not drop below thresholds (80% lines/functions, 75% branches)
- [ ] Lint and type-check pass (`npm run lint && npm run typecheck`)

## Write operations (if applicable)

- [ ] New write tools include `confirm` and `dryRun` fields in their schema
- [ ] `assertWritePermitted()` is called as the first statement in the service method
- [ ] `dryRun` path returns `{ dryRun: true, payload }` without making an API call
- [ ] Tool handler checks `requireConfirm && !confirm && !dryRun` and returns a prompt

## Documentation (if applicable)

- [ ] `docs/API.md` updated with new or modified tools
- [ ] `docs/ENVIRONMENT.md` updated if new env vars were added
- [ ] `CHANGELOG.md` entry added under `[Unreleased]`

## Checklist

- [ ] No `console.log` / `console.error` added outside `src/config/env.ts`
- [ ] No `process.env.X` access outside `src/config/env.ts`
- [ ] No hardcoded credentials or secrets
- [ ] No `eval()` or `new Function()`
- [ ] `.js` extensions used on all local ESM imports
