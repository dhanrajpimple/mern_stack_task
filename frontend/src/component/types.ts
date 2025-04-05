export type Product = {
    id: string
    name: string
    description: string
    price: number
    category: string
    available: boolean
    quantity: number
    image: string
  }
  
  export type ProductModalProps = {
    product?: Product
    onClose: () => void
    onSave: (product: any) => void
    categories: string[]
  }