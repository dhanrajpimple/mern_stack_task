import { useState } from "react";
import { Edit, Trash, X } from "lucide-react";
import type { Product } from "./types";
import { deleteProduct } from "../utils/api";
type ProductCardProps = {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteProduct(product._id); // Actual API call
      setIsModalOpen(false);
      onDelete(); // Let parent refresh the list
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  return (
    <>
      {/* Product Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {product.description}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-lg font-medium text-gray-900">
                {typeof product.price === "number"
                  ? `$${product.price.toFixed(2)}`
                  : "N/A"}
              </span>

              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  product.quantity > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.quantity > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">
                {product.name}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-contain rounded-lg"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Description
                      </h3>
                      <p className="mt-1 text-gray-700">
                        {product.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Price
                      </h3>
                      <p className="mt-1 text-xl font-semibold text-gray-900">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Category
                      </h3>
                      <p className="mt-1 text-gray-700">{product.category}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Availability
                      </h3>
                      <p
                        className={`mt-1 inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          product.quantity > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsModalOpen(false);
                        onEdit();
                      }}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
