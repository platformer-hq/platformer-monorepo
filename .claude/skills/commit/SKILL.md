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
3. Create the commit with proper formatting

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
