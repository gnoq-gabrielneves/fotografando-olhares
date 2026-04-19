export type Profile = {
  id: string;
  full_name: string;
  role: "admin" | "extensionista" | "laudador";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};
