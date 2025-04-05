import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState } from "react";
import ProductCard from "./ProductCard";
type ProductGridProps = {
  products: {};
  showProductDetails: number | null;
  onToggleDetails: (productId: number) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  itemsPerPage?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function ProductGrid({
  products,
  showProductDetails,
  onToggleDetails,
  onEditProduct,
  onDeleteProduct,
  itemsPerPage = 6,
  currentPage,
  onPageChange,
}: ProductGridProps) {
  const goToPage = (page: number) => {
    onPageChange(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Calculate pagination
  const totalPages = products.totalPages;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.products.slice(startIndex, endIndex);

  // Generate visible page numbers
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  return (
    <>
      {/* Product cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            showDetails={showProductDetails === product.id}
            onToggleDetails={() => onToggleDetails(product.id)}
            onEdit={() => onEditProduct(product)}
            onDelete={() => onDeleteProduct(product.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {products.totalProducts > itemsPerPage && (
        <div className="mt-8 flex justify-end items-center gap-4">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => goToPage(1)} disabled={currentPage === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {getVisiblePages().map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 rounded ${
                  page === currentPage
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
