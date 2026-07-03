-- Allow users to delete clinical documents within their accessible organization.
-- Developers keep cross-organization access through current_user_can_access_organization.

drop policy if exists "Users can delete clinical documents from their organization"
on public.clinical_documents;

create policy "Users can delete clinical documents from their organization"
on public.clinical_documents
for delete
using (public.current_user_can_access_organization(organization_id));

