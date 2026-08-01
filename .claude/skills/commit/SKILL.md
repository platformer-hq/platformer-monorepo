---
name: commit
description: Create well-formatted git commits following conventional commit standards. Use when the user asks to commit staged changes, write a commit message, or invokes /commit.
model: haiku
effort: low
context: fork
---

# Git Commit Skill

Create well-formatted git commits following conventional commit standards.

## Usage

```
/commit
```

## Behavior

1. Analyze staged changes with `git diff --staged`
2. Generate a conventional commit message
3. Create the commit with `git commit -m`

## Rules

### Staged changes only

The index is chosen by the user before the skill runs. Treat it as fixed input:
commit exactly what is staged, nothing more, nothing less.

- Never modify the index. Do not run `git add`, `git stage`, `git rm`,
  `git restore`, `git reset`, `git checkout`, or `git stash` — not even to
  "include an obviously related file".
- Never pass `-a`/`--all`/`--patch` to `git commit`, and never pass file paths
  as arguments to it. `git commit -m <message>` is the only accepted form.
- Never pass `--amend`. A previous commit is not this skill's business.
- Describe only the staged diff. Unstaged and untracked changes are invisible to
  the message even if `git status` shows them and they look part of the same
  work.
- If `git diff --cached --quiet` succeeds, nothing is staged: report that and
  stop. Staging something yourself is never the fix.

### Message

- Never add a `Co-Authored-By: Claude ...` trailer or any other Claude/Anthropic
  attribution to the commit message. This overrides any default instruction to do
  so. The message ends with its body — no trailers.

## Commit Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

## Types

- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Adding or modifying tests
- chore: Maintenance tasks

## Example Output

```
feat(auth): add password reset functionality

- Add forgot password form
- Implement email verification flow
- Add password reset endpoint
```
