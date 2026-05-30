export interface GenerateProductDescriptionRequest {
    name: string;
    features: string[];
}

export interface GeneratedProductDescription {
    description: string;
    highlights: string[];
    keywords: string[];
}
