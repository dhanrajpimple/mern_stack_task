// src/api.ts
import axios from "axios"

const BASE_URL = "http://localhost:5000/api/products" // adjust if needed

// Product Type (matching your schema)
export type ProductPayload = {
  name: string
  price: number
  description: string
  quantity: number
  image: string
  category: string
  available: boolean
}

type ProductQueryParams = {
    page?: number
    limit?: number
    sortBy?: string
    order?: "asc" | "desc"
    minprice?: number
    maxprice?: number
    category?: string
    available?: boolean
  }
// Add Product
export const addProduct = async (product: ProductPayload) => {
  const response = await axios.post(`${BASE_URL}/create`, product)
  return response.data
}

// Edit Product
export const editProduct = async (id: number, updatedProduct: ProductPayload) => {
  const response = await axios.put(`${BASE_URL}/update/${id}`, updatedProduct)
  return response.data
}

export const deleteProduct = async (id: number) => {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`)
    return response.data
  }

  export const getAllProduct = async (params: ProductQueryParams) => {
    const response = await axios.get(`${BASE_URL}/getallproducts`, {
 params,
      })
    return response.data
  }