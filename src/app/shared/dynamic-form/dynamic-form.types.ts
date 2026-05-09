export type FieldType = 'text' | 'number' | 'boolean' | 'select' | 'array' | 'image' | 'textarea';

export interface DynamicField {
  key: string;
  label: string;
  type: FieldType;
  folder?: string; // for image fields, specify upload folder
  autoSave?: boolean;

  group?: string;

  options?: string[];

  itemSchema?: DynamicField[];

  placeholder?: string;
  help?: string;
}

export interface DynamicGroupUI {
  icon: string;
  subtitle: string;
}

export interface DynamicFormSchema {
  fields: DynamicField[];
  groupUI?: Record<string, DynamicGroupUI>;
}