"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Database, AlertCircle, Package, ArrowLeft, Loader2, Edit } from 'lucide-react';
import Link from 'next/link';

interface ProductNote {
    note_type: 'top' | 'heart' | 'base';
    notes: {
        id: string;
        name: string;
    };
}

interface Product {
    id: string;
    name: string;
    price: number;
    slug: string;
    formula_code: string;
    stock_quantity: number;
    description?: string;
    concentration?: string;
    product_notes?: ProductNote[];
    is_deleted?: boolean;
    created_by?: string;
    modified_by?: string;
    created_at?: string;
    updated_at?: string;
}

export default function InventoryPage() {
    const { user, loading: authLoading } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        price: '',
        formula_code: '',
        description: '',
        concentration: 'Eau de Parfum',
        stock_quantity: '50',
        top_notes: '',
        heart_notes: '',
        base_notes: '',
    });

    const isAuthorized = user?.email === '69nainu@gmail.com';

    useEffect(() => {
        if (!authLoading && isAuthorized) {
            fetchProducts();
        }
    }, [authLoading, isAuthorized]);

    async function fetchProducts() {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select(`
                id, name, price, slug, formula_code, stock_quantity, description, concentration, is_deleted,
                created_at, updated_at, created_by, modified_by,
                product_notes (
                    note_type,
                    notes (id, name)
                )
            `)
            .eq('is_deleted', false)
            .order('created_at', { ascending: false });

        if (!error && data) setProducts(data as any);
        setLoading(false);
    }

    const resetForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({
            name: '', slug: '', price: '', formula_code: '', description: '', concentration: 'Eau de Parfum', stock_quantity: '50',
            top_notes: '', heart_notes: '', base_notes: '',
        });
    };

    async function handleSubmitProduct(e: React.FormEvent) {
        e.preventDefault();
        setActionLoading(true);

        const productPayload: any = {
            name: formData.name,
            slug: formData.slug,
            price: parseFloat(formData.price),
            formula_code: formData.formula_code,
            description: formData.description,
            concentration: formData.concentration,
            stock_quantity: parseInt(formData.stock_quantity),
            brand: 'ELEMENT 01'
        };

        try {
            // 1. Upsert Product
            let productId: string;
            if (editingId) {
                productPayload.modified_by = user?.id;
                const { error } = await supabase.from('products').update(productPayload).eq('id', editingId);
                if (error) throw error;
                productId = editingId;
            } else {
                productPayload.created_by = user?.id;
                const { data, error } = await supabase.from('products').insert([productPayload]).select('id').single();
                if (error) throw error;
                productId = data.id;
            }

            // 2. Sync Notes
            const noteCategories = [
                { type: 'top', names: formData.top_notes.split(',').map(s => s.trim()).filter(Boolean) },
                { type: 'heart', names: formData.heart_notes.split(',').map(s => s.trim()).filter(Boolean) },
                { type: 'base', names: formData.base_notes.split(',').map(s => s.trim()).filter(Boolean) },
            ];

            // Delete existing relations if editing
            if (editingId) {
                await supabase.from('product_notes').delete().eq('product_id', productId);
            }

            for (const category of noteCategories) {
                for (const noteName of category.names) {
                    // Find or create note
                    let { data: note, error: noteError } = await supabase
                        .from('notes')
                        .select('id')
                        .eq('name', noteName)
                        .maybeSingle();

                    if (noteError) throw noteError;

                    let noteId: string;
                    if (!note) {
                        const { data: newNote, error: createError } = await supabase
                            .from('notes')
                            .insert([{ name: noteName, category: 'General' }])
                            .select('id')
                            .single();
                        if (createError) throw createError;
                        noteId = newNote.id;
                    } else {
                        noteId = note.id;
                    }

                    // Create relation
                    const { error: relError } = await supabase
                        .from('product_notes')
                        .insert([{ product_id: productId, note_id: noteId, note_type: category.type }]);
                    if (relError) throw relError;
                }
            }

            resetForm();
            fetchProducts();
        } catch (error: any) {
            alert(`SYSTEM_ERROR: ${error.message}`);
        } finally {
            setActionLoading(false);
        }
    }

    const handleEditClick = (product: Product) => {
        const getNotesByType = (type: string) =>
            product.product_notes
                ?.filter(pn => pn.note_type === type)
                .map(pn => pn.notes.name)
                .join(', ') || '';

        setEditingId(product.id);
        setFormData({
            name: product.name,
            slug: product.slug,
            price: product.price.toString(),
            formula_code: product.formula_code,
            description: product.description || '',
            concentration: product.concentration || 'Eau de Parfum',
            stock_quantity: product.stock_quantity.toString(),
            top_notes: getNotesByType('top'),
            heart_notes: getNotesByType('heart'),
            base_notes: getNotesByType('base'),
        });
        setIsFormOpen(true);
    };

    async function handleDeleteProduct(id: string) {
        if (!confirm('ARCHIVE_SPECIMEN_ENTRY: Are you sure you want to SOFT_DELETE this node?')) return;

        setActionLoading(true);
        const { error } = await supabase
            .from('products')
            .update({ is_deleted: true })
            .eq('id', id);

        if (!error) {
            fetchProducts();
        } else {
            alert(`SYSTEM_ERROR: ${error.message}`);
        }
        setActionLoading(false);
    }

    if (authLoading || (loading && products.length === 0)) {
        return (
            <main className="min-h-screen bg-[rgb(var(--background-rgb))] font-mono text-[rgb(var(--foreground-rgb))] pt-32 px-8 flex items-center justify-center transition-colors duration-500">
                <div className="animate-pulse text-[10px] font-black uppercase tracking-[0.5em]">Syncing_Central_Database...</div>
            </main>
        );
    }

    if (!isAuthorized) {
        return (
            <main className="min-h-screen bg-[rgb(var(--background-rgb))] font-mono text-[rgb(var(--foreground-rgb))] pt-32 px-8 flex flex-col items-center justify-center space-y-4 transition-colors duration-500">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <h1 className="text-xl font-black uppercase">ACCESS_DENIED_PROTOCOL_ENTRY</h1>
                <p className="text-[10px] opacity-40 max-w-xs text-center uppercase tracking-widest">
                    This node is not authorized for inventory control. Contact administrator.
                </p>
                <Link href="/" className="px-6 py-2 border border-[rgb(var(--border-color))] text-[10px] font-black uppercase tracking-widest hover:bg-[rgb(var(--foreground-rgb))] hover:text-[rgb(var(--background-rgb))] transition-all">
                    Return_to_safety
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[rgb(var(--background-rgb))] font-mono text-[rgb(var(--foreground-rgb))] pt-32 px-6 md:px-10 pb-32 transition-colors duration-500">
            <div className="max-w-[1400px] mx-auto space-y-12">

                {/* Header */}
                <header className="flex justify-between items-end border-b-2 border-[rgb(var(--border-color))] pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Database className="w-4 h-4 text-neutral-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">CENTRAL_REPOSITORY_v4.2</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">Inventory_Analysis</h1>
                    </div>
                    <button
                        onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
                        className="bg-[rgb(var(--foreground-rgb))] text-[rgb(var(--background-rgb))] px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-500 transition-all flex items-center gap-3 shadow-xl transition-colors duration-500"
                    >
                        {isFormOpen ? <ArrowLeft className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {isFormOpen ? 'CANCEL_PROTOCOL' : 'ADD_NEW_SPECIMEN'}
                    </button>
                </header>

                <AnimatePresence mode="wait">
                    {isFormOpen ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-[rgb(var(--card-bg))] border-2 border-[rgb(var(--border-color))] p-12 md:p-16 shadow-[20px_20px_0px_rgba(var(--foreground-rgb),0.05)] transition-colors duration-500"
                        >
                            <h2 className="text-sm font-black uppercase mb-10 border-b-2 border-[rgb(var(--border-color)/5%)] pb-5">
                                {editingId ? `MODIFICATION_PROTOCOL: ${formData.name}` : 'NEW_SPECIMEN_ENROLLMENT'}
                            </h2>
                            <form onSubmit={handleSubmitProduct} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Entry_Label</label>
                                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="E.g., AMBER-MOD-01" className="w-full border-2 border-[rgb(var(--border-color)/10%)] bg-[rgb(var(--background-rgb))] p-3 text-xs focus:border-[rgb(var(--foreground-rgb))] outline-none transition-colors text-[rgb(var(--foreground-rgb))]" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Molecular_Slug</label>
                                        <input required value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="e.g., amber-mod-01" className="w-full border-2 border-[rgb(var(--border-color)/10%)] bg-[rgb(var(--background-rgb))] p-3 text-xs focus:border-[rgb(var(--foreground-rgb))] outline-none transition-colors text-[rgb(var(--foreground-rgb))]" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Financial_Value ($)</label>
                                        <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" className="w-full border-2 border-[rgb(var(--border-color)/10%)] bg-[rgb(var(--background-rgb))] p-3 text-xs focus:border-[rgb(var(--foreground-rgb))] outline-none transition-colors text-[rgb(var(--foreground-rgb))]" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Formula_Registry_Code</label>
                                        <input required value={formData.formula_code} onChange={e => setFormData({ ...formData, formula_code: e.target.value })} placeholder="e.g., C20H32O" className="w-full border-2 border-[rgb(var(--border-color)/10%)] bg-[rgb(var(--background-rgb))] p-3 text-xs focus:border-[rgb(var(--foreground-rgb))] outline-none transition-colors text-[rgb(var(--foreground-rgb))]" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Stock_Volume</label>
                                        <input required type="number" value={formData.stock_quantity} onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })} placeholder="50" className="w-full border-2 border-[rgb(var(--border-color)/10%)] bg-[rgb(var(--background-rgb))] p-3 text-xs focus:border-[rgb(var(--foreground-rgb))] outline-none transition-colors text-[rgb(var(--foreground-rgb))]" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Description_Log</label>
                                        <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Detailed specimen analysis..." className="w-full border-2 border-[rgb(var(--border-color)/10%)] bg-[rgb(var(--background-rgb))] p-3 text-xs h-20 focus:border-[rgb(var(--foreground-rgb))] outline-none transition-colors resize-none text-[rgb(var(--foreground-rgb))]" />
                                    </div>
                                </div>

                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-10 pt-6 border-t-2 border-black/5">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Top_Notes (CSV)</label>
                                        <input value={formData.top_notes} onChange={e => setFormData({ ...formData, top_notes: e.target.value })} placeholder="e.g. Bergamot, Lemon" className="w-full border-2 border-[rgb(var(--border-color)/10%)] p-3 text-xs focus:border-[rgb(var(--foreground-rgb))] outline-none bg-[rgb(var(--foreground-rgb)/3%)] transition-colors text-[rgb(var(--foreground-rgb))]" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-600">Heart_Notes (CSV)</label>
                                        <input value={formData.heart_notes} onChange={e => setFormData({ ...formData, heart_notes: e.target.value })} placeholder="e.g. Rose, Jasmine" className="w-full border-2 border-[rgb(var(--border-color)/10%)] p-3 text-xs focus:border-[rgb(var(--foreground-rgb))] outline-none bg-[rgb(var(--foreground-rgb)/3%)] transition-colors text-[rgb(var(--foreground-rgb))]" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">Base_Notes (CSV)</label>
                                        <input value={formData.base_notes} onChange={e => setFormData({ ...formData, base_notes: e.target.value })} placeholder="e.g. Musk, Amber" className="w-full border-2 border-[rgb(var(--border-color)/10%)] p-3 text-xs focus:border-[rgb(var(--foreground-rgb))] outline-none bg-[rgb(var(--foreground-rgb)/3%)] transition-colors text-[rgb(var(--foreground-rgb))]" />
                                    </div>
                                </div>
                                <div className="md:col-span-2 pt-6">
                                    <button disabled={actionLoading} className="w-full py-5 bg-[rgb(var(--foreground-rgb))] text-[rgb(var(--background-rgb))] font-black uppercase tracking-[0.3em] hover:bg-orange-600 transition-all flex items-center justify-center gap-3 text-xs shadow-xl transition-colors duration-500">
                                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                                        {actionLoading ? 'EXECUTING_DATA_INSERTION...' : (editingId ? 'UPDATE_SPECIMEN_DATA' : 'COMMIT_TO_CENTRAL_REGISTRY')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-[rgb(var(--card-bg))] border-2 border-[rgb(var(--border-color))] shadow-[15px_15px_0px_rgba(var(--foreground-rgb),0.03)] overflow-hidden transition-colors duration-500"
                        >
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[rgb(var(--foreground-rgb))] text-[rgb(var(--background-rgb))] text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500">
                                        <th className="p-6">Registry_ID</th>
                                        <th className="p-6">Designation</th>
                                        <th className="p-6">Formula_Node</th>
                                        <th className="p-6">Financials</th>
                                        <th className="p-6 text-center">Volume</th>
                                        <th className="p-6 text-right">Action_Commands</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id} className="border-b-2 border-[rgb(var(--border-color)/5%)] hover:bg-[rgb(var(--foreground-rgb)/3%)] transition-colors text-[11px]">
                                            <td className="p-6 font-black opacity-30">{product.id.slice(0, 8)}...</td>
                                            <td className="p-6">
                                                <div className="font-black uppercase text-xs">{product.name}</div>
                                                <div className="opacity-40 text-[8px] mt-1 space-x-2">
                                                    <span className="tracking-widest">{product.slug}</span>
                                                    <span className="text-blue-500 font-black bg-blue-500/10 px-1.5 py-0.5 border border-blue-500/20 italic">MOD: {new Date(product.updated_at || '').toLocaleDateString('en-GB')}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 font-black text-orange-600 tracking-[0.1em]">{product.formula_code}</td>
                                            <td className="p-6 font-black text-sm">${product.price.toFixed(2)}</td>
                                            <td className="p-6 text-center">
                                                <span className={`px-3 py-1.5 font-black inline-block min-w-[40px] transition-colors duration-500 ${product.stock_quantity < 10 ? 'bg-red-500 text-white' : 'bg-[rgb(var(--foreground-rgb)/10%)] text-[rgb(var(--foreground-rgb))]'}`}>
                                                    {product.stock_quantity}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right flex justify-end gap-3">
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="p-2 text-[rgb(var(--foreground-rgb))] hover:bg-[rgb(var(--foreground-rgb))] hover:text-[rgb(var(--background-rgb))] transition-all rounded-sm border border-[rgb(var(--border-color)/10%)]"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="p-2 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm border border-red-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-20 text-center space-y-4">
                                                <Package className="w-12 h-12 mx-auto opacity-10" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">No_Specimens_Found_in_Registry</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-12 text-[9px] font-black uppercase tracking-[0.3em] opacity-30 pt-8 border-t border-[rgb(var(--border-color)/5%)]">
                    <span>TOTAL_ASSETS: {products.length}</span>
                    <span>SYSTEM_VERSION: v4.2.0</span>
                    <span>STABILITY_STATUS: [OPTIMAL]</span>
                </div>

            </div>
        </main>
    );
}
