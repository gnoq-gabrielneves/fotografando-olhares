export type OrganizationScopedRecord = {
  organization_id?: string | null;
};

export function getOrganizationIdFromRecord(
  record: OrganizationScopedRecord | null | undefined,
) {
  return record?.organization_id || undefined;
}

export function withOrganizationId<T extends Record<string, unknown>>(
  payload: T,
  organizationId?: string | null,
) {
  if (!organizationId) return payload;
  return {
    ...payload,
    organization_id: organizationId,
  };
}
