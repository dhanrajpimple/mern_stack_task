import React, { useState } from "react"
import { X } from "lucide-react"
import type { Product } from "./types"
import { addProduct, editProduct } from "../utils/api"

type ProductModalProps = {
  product?: Product
  onClose: () => void
  onSave: (product: Product) => void
  categories: string[]
}

export default function ProductModal({
  product,
  onClose,
  onSave,
  categories,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Omit<Product, "_id"> & { _id?: string }>({
    _id: product?._id,
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    quantity: product?.quantity || 1,
    category: product?.category || categories[0],
    available: product?.available ?? true,
    image: product?.image || "/placeholder.svg?height=200&width=200",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement
      setFormData({ ...formData, [name]: target.checked })
    } else if (name === "price" || name === "quantity") {
      setFormData({ ...formData, [name]: Number(value) })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (formData._id) {
        console.log("Editing product:", formData)
        const updated = await editProduct(formData._id, formData)
        onSave(updated)
      } else {
        const created = await addProduct(formData)
        onSave(created)
      }
      onClose()
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Something went wrong while saving the product.")
    }
  }

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
      <div className="bg-gray-200 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            {formData._id ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <InputField label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
          <TextareaField label="Description" name="description" value={formData.description} onChange={handleChange} />
          <InputField label="Price ($)" name="price" value={formData.price} onChange={handleChange} type="number" min="1" step="1" required />
          <InputField label="Quantity" name="quantity" value={formData.quantity} onChange={handleChange} type="number" min="0" required />

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              
              <option key="Sport" value="Sport">Sport</option>
                <option key="Electronics" value="Electronics">Electronics</option>
                <option key="Fashion" value="Fashion">Fashion</option>
                <option key="Food" value="Food">Food</option>
                <option key="Beauty" value="Beauty">Beauty</option>
            </select>
          </div>

          <InputField label="Image URL" name="image" value={formData.image} onChange={handleChange} />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
              In Stock
            </label>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              {formData._id ? "Update" : "Add"} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Reusable Input Field
function InputField({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label htmlFor={props.name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...props}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  )
}

// Reusable Textarea Field
function TextareaField({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div>
      <label htmlFor={props.name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        {...props}
        rows={3}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  )
}
