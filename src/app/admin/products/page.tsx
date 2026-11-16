'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Check,
  X,
  Search,
  Filter,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useToast } from '@/components/ui/Toast';
import { Product, ProductCondition, CategorySlug } from '@/types';
import { formatINR } from '@/lib/utils';
import { ConditionBadge } from '@/components/product/ConditionBadge';
import { CATEGORIES } from '@/data/categories';

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const initialFormState = {
    name: '',
    slug: '',
    description: '',
    price: 2490,
    original_price: 7990,
    category_slug: 'vintage-tees' as CategorySlug,
    brand: '',
    size: 'L',
    gender: 'unisex' as 'men' | 'women' | 'unisex',
    condition: 'Vintage' as ProductCondition,
    color: '',
    material: '',
    measurements: {
      chest: '22 in',
      length: '28 in',
      shoulders: '20 in',
      fitNotes: '',
    },
    stock_quantity: 1,
    is_featured: false,
    is_new_arrival: true,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900'],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      original_price: p.original_price,
      category_slug: p.category_slug,
      brand: p.brand,
      size: p.size,
      gender: p.gender,
      condition: p.condition,
      color: p.color,
      material: p.material,
      measurements: {
        chest: p.measurements.chest || '',
        length: p.measurements.length || '',
        shoulders: p.measurements.shoulders || '',
        fitNotes: p.measurements.fitNotes || '',
      },
      stock_quantity: p.stock_quantity,
      is_featured: p.is_featured,
      is_new_arrival: p.is_new_arrival,
      images: p.images.length > 0 ? p.images : initialFormState.images,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.brand.trim()) {
      showToast('Name and Brand are required fields', 'error');
      return;
    }

    const categoryObj = CATEGORIES.find((c) => c.slug === formData.category_slug);
    const category_name = categoryObj?.name || 'Vintage Collection';
    const category_id = categoryObj?.id || 'cat-1';
    const generatedSlug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        slug: generatedSlug,
        category_name,
        category_id,
      });
      showToast(`Updated "${formData.name}" successfully`, 'success');
    } else {
      addProduct({
        ...formData,
        slug: generatedSlug,
        category_name,
        category_id,
      });
      showToast(`Added "${formData.name}" to inventory`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from inventory?`)) {
      deleteProduct(id);
      showToast(`Deleted "${name}"`, 'info');
    }
  };

  const handleToggleSoldOut = (p: Product) => {
    const newStock = p.stock_quantity > 0 ? 0 : 1;
    updateProduct(p.id, { stock_quantity: newStock });
    showToast(newStock === 0 ? `Marked "${p.name}" as sold out` : `Restocked "${p.name}" with 1 unit`, 'info');
  };

  const handleToggleFeatured = (p: Product) => {
    updateProduct(p.id, { is_featured: !p.is_featured });
    showToast(`Updated featured status for "${p.name}"`, 'success');
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? p.category_slug === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-charcoal/10 gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-vintage-brown font-semibold block mb-1">
            INVENTORY MANAGEMENT
          </span>
          <h1 className="font-display font-black text-3xl uppercase tracking-tight text-charcoal">
            PRODUCT ARCHIVE ({products.length})
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 bg-charcoal text-cream hover:bg-charcoal/90 font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Archive Piece</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-soft-white border border-charcoal/15 p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search piece by name or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-charcoal/20 focus:outline-none focus:border-charcoal bg-cream/20"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-xs font-mono border border-charcoal/20 bg-cream/20 focus:outline-none"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-soft-white border border-charcoal/15 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-charcoal/15 bg-charcoal/5 uppercase text-charcoal/70">
              <th className="p-3.5">Piece</th>
              <th className="p-3.5">Brand</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Condition</th>
              <th className="p-3.5">Price / Orig</th>
              <th className="p-3.5">Stock</th>
              <th className="p-3.5 text-center">Featured</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-cream/40 transition-colors">
                <td className="p-3.5">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-12 bg-light-grey flex-shrink-0 overflow-hidden border border-charcoal/10">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-charcoal line-clamp-1 max-w-xs">
                        {product.name}
                      </h4>
                      <span className="text-[10px] text-charcoal/50">Size: {product.size}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 font-bold">{product.brand}</td>
                <td className="p-3.5 text-charcoal/70">{product.category_name}</td>
                <td className="p-3.5">
                  <ConditionBadge condition={product.condition} size="sm" />
                </td>
                <td className="p-3.5">
                  <div className="font-bold text-charcoal">{formatINR(product.price)}</div>
                  <div className="text-[10px] text-charcoal/40 line-through">
                    {formatINR(product.original_price)}
                  </div>
                </td>
                <td className="p-3.5">
                  <button
                    onClick={() => handleToggleSoldOut(product)}
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                      product.stock_quantity > 0
                        ? 'bg-olive/15 text-olive-600 border-olive/30 hover:bg-olive/20'
                        : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
                    }`}
                    title="Click to toggle sold out"
                  >
                    {product.stock_quantity > 0 ? `${product.stock_quantity} In Stock` : 'Sold Out'}
                  </button>
                </td>
                <td className="p-3.5 text-center">
                  <button
                    onClick={() => handleToggleFeatured(product)}
                    className={`w-6 h-6 rounded-full inline-flex items-center justify-center border transition-colors ${
                      product.is_featured
                        ? 'bg-vintage-brown text-cream border-vintage-brown'
                        : 'bg-charcoal/5 text-charcoal/30 border-charcoal/15'
                    }`}
                    title="Toggle featured grail"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-1.5 text-charcoal/70 hover:text-charcoal border border-charcoal/15 hover:border-charcoal bg-soft-white"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-1.5 text-red-600/70 hover:text-red-700 border border-red-200 hover:border-red-500 bg-red-50"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm overflow-y-auto">
          <form
            onSubmit={handleSaveProduct}
            className="bg-cream border border-charcoal/20 max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto space-y-6 text-xs font-mono"
          >
            <div className="flex justify-between items-center pb-4 border-b border-charcoal/10">
              <h2 className="font-display font-bold uppercase text-lg text-charcoal">
                {editingProduct ? 'Edit Archive Piece' : 'Add New Archive Piece'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-charcoal/60 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block uppercase text-charcoal/70 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1998 Carhartt Detroit Jacket"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-charcoal/20 bg-soft-white text-charcoal font-sans"
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal/70 mb-1">Brand / Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Carhartt, Levi's, Nike"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal/70 mb-1">Category *</label>
                <select
                  value={formData.category_slug}
                  onChange={(e) =>
                    setFormData({ ...formData, category_slug: e.target.value as CategorySlug })
                  }
                  className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block uppercase text-charcoal/70 mb-1">Thrift Price (INR) *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal/70 mb-1">
                  Original Retail Price (INR) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.original_price}
                  onChange={(e) =>
                    setFormData({ ...formData, original_price: Number(e.target.value) })
                  }
                  className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal/70 mb-1">Condition Grade *</label>
                <select
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData({ ...formData, condition: e.target.value as ProductCondition })
                  }
                  className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                >
                  <option value="Brand New With Tags">Brand New With Tags</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Vintage">Vintage</option>
                </select>
              </div>

              <div>
                <label className="block uppercase text-charcoal/70 mb-1">Size *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. L, 32x32, M"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal/70 mb-1">Inventory Quantity *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stock_quantity: Number(e.target.value) })
                  }
                  className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal/70 mb-1">Color</label>
                <input
                  type="text"
                  placeholder="e.g. Faded Brown"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block uppercase text-charcoal/70 mb-1">Material Composition</label>
                <input
                  type="text"
                  placeholder="e.g. 100% Heavy Duck Cotton Canvas"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block uppercase text-charcoal/70 mb-1">
                  Product Description & Archive History *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-charcoal/20 bg-soft-white font-sans text-xs"
                />
              </div>

              {/* Measurements */}
              <div>
                <label className="block uppercase text-charcoal/70 mb-1">Pit to Pit (Chest)</label>
                <input
                  type="text"
                  value={formData.measurements.chest}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      measurements: { ...formData.measurements, chest: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal/70 mb-1">Total Length</label>
                <input
                  type="text"
                  value={formData.measurements.length}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      measurements: { ...formData.measurements, length: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                />
              </div>

              {/* Image URLs & Upload */}
              <div className="sm:col-span-2 space-y-2">
                <label className="block uppercase text-charcoal/70">Product Image URLs</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 p-2.5 border border-charcoal/20 bg-soft-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2.5 bg-charcoal text-cream uppercase font-bold"
                  >
                    Add Image
                  </button>
                </div>

                {/* Thumbnails preview */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-20 border border-charcoal/20 overflow-hidden group"
                    >
                      <Image src={img} alt={`Preview ${idx}`} fill className="object-cover" sizes="64px" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-red-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="sm:col-span-2 flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded-none accent-charcoal"
                  />
                  <span>Featured Piece on Homepage</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_new_arrival}
                    onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                    className="rounded-none accent-charcoal"
                  />
                  <span>Mark as New Arrival Drop</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-charcoal/10">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 border border-charcoal/20 text-charcoal uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-charcoal text-cream uppercase font-bold tracking-wider"
              >
                {editingProduct ? 'Save Changes' : 'Create Piece'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
