export interface ProductImage {
  id?: string;
  file?: File | null;
  url: string;
  publicId?: string;
  isPrimary: boolean;
  order?: number;
  isNew?: boolean;
}