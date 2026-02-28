import { createClient } from '@supabase/supabase-js';

// We use ! to tell TypeScript these will definitely exist 
// because we added them to .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


/**
 * ELEMENT 01 // DATABASE_SCHEMA_v1.0
 * --------------------------------------------------------
 * * TABLE: products (Core Inventory & Molecular Data)
 * - id: uuid (PK)
 * - name: text (Commercial name, e.g., 'ISO-01')
 * - brand: text (Default: 'ELEMENT 01')
 * - slug: text (Unique, e.g., 'iso-01')
 * - description: text (Technical/Marketing copy)
 * - price: decimal (Retail price)
 * - concentration: text (e.g., 'Eau de Parfum')
 * - image_url: text (CDN/Storage link)
 * - formula_code: text (Chemical ID, e.g., 'C16H26O')
 * - longevity_hours: int (Wear time)
 * - sillage_rank: int (1-5 projection)
 * - molecular_weight: text (Aesthetic data, e.g., '234.38 g/mol')
 * - stock_quantity: int (Default: 50)
 * - created_at: timestamptz
 * * TABLE: notes (Molecular Ingredient Library)
 * - id: uuid (PK)
 * - name: text (Unique, e.g., 'Ambroxan')
 * - category: text (e.g., 'Synthetic', 'Woody')
 * * TABLE: product_notes (Junction / Scent Pyramid)
 * - product_id: uuid (FK -> products.id)
 * - note_id: uuid (FK -> notes.id)
 * - note_type: text (Constraint: 'top' | 'heart' | 'base')
 * * TABLE: cart_items (Future Implementation)
 * - id: uuid (PK)
 * - user_id: uuid (FK -> auth.users)
 * - product_id: uuid (FK -> products.id)
 * - quantity: int
 */