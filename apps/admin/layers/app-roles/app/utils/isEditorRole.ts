export function isEditorRole(role: LocalAppRole): boolean {
  return [LocalAppRole.Admin, LocalAppRole.Owner].includes(role);
}
