/**
 * ELEMENT 01 // TYPE_DEFINITIONS
 * These types match your Supabase schema exactly.
 */

export type ScentNoteType = 'top' | 'heart' | 'base';

export interface ScentNote {
    id: string;
    name: string;
    category: string | null;
}

export interface ProductNoteJoin {
    note_type: ScentNoteType;
    notes: ScentNote; // This matches the nested object from a Supabase join
}

export interface Product {
    id: string;
    name: string;
    brand: string;
    slug: string;
    description: string | null;
    price: number;
    concentration: string | null;
    image_url: string | null;
    formula_code: string | null;
    longevity_hours: number | null;
    sillage_rank: number | null;
    molecular_weight: string | null;
    stock_quantity: number;
    created_at: string;
    // This optional field represents the joined notes from product_notes
    product_notes?: ProductNoteJoin[];
}