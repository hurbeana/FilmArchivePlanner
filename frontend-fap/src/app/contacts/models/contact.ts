export interface Contact {
  id: number;
  type: any; //TODO Replace this with "Tag"
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  created_at: string;
}
