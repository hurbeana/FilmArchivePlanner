import { Tag } from '../../tags/models/tag';
export interface Contact {
  id: number;
  type: Tag;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  created_at: string;
}
