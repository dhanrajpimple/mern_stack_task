import { useState, useEffect } from "react";
import Navbar from "./component/Navbar";
import FilterSection from "./component/Filters";
import ProductGrid from "./component/ProductList";
import ProductModal from "./component/ProductModal";
import type { Product } from "./component/types";
import { getAllProduct } from "./utils/api";

// Type for full product state returned by API
type ProductListState = {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
};

export default function App() {
  const [products, setProducts] = useState<ProductListState>({
    products: [],
    totalProducts: 0,
    totalPages: 0,
    currentPage: 1,
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductDetails, setSelectedProductDetails] =
    useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page to 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, selectedCategories, showAvailableOnly]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchProducts = async () => {
        try {
          const result = await getAllProduct({
            page: currentPage,
            limit: itemsPerPage,
            sortBy: "price",
            order: "asc",
            minprice: priceRange[0],
            maxprice: priceRange[1],
            category: selectedCategories.join(",") || undefined,
            available: showAvailableOnly ? true : undefined,
          });
          setProducts(result);
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
      };

      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [
    currentPage,
    itemsPerPage,
    priceRange,
    selectedCategories,
    showAvailableOnly,
  ]);

  const handleAddProduct = async () => {
    const result = await getAllProduct({
      page: currentPage,
      limit: itemsPerPage,
      sortBy: "price",
      order: "asc",
      minprice: priceRange[0],
      maxprice: priceRange[1],
      category: selectedCategories.join(",") || undefined,
      available: showAvailableOnly ? true : undefined,
    });
    setProducts(result);
    setShowAddModal(false);
  };

  const handleEditProduct = async () => {
    const result = await getAllProduct({
      page: currentPage,
      limit: itemsPerPage,
      sortBy: "price",
      order: "asc",
      minprice: priceRange[0],
      maxprice: priceRange[1],
      category: selectedCategories.join(",") || undefined,
      available: showAvailableOnly ? true : undefined,
    });
    setProducts(result);
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  const onDeleteProduct = async () => {
    try {
      const result = await getAllProduct({
        page: currentPage,
        limit: itemsPerPage,
        sortBy: "price",
        order: "asc",
        minprice: priceRange[0],
        maxprice: priceRange[1],
        category: selectedCategories.join(",") || undefined,
        available: showAvailableOnly ? true : undefined,
      });
      setProducts(result);
    } catch (error) {
      console.error("Failed to refresh product list after delete:", error);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleEditProductButton = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const toggleProductDetails = (product: Product) => {
    setSelectedProductDetails(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onAddProduct={() => setShowAddModal(true)}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSection
            visible={showFilters}
            onClose={() => setShowFilters(false)}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedCategories={selectedCategories}
            onCategoryToggle={toggleCategory}
            showAvailableOnly={showAvailableOnly}
            onAvailabilityChange={setShowAvailableOnly}
          />

          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">
                {products.totalProducts} product
                {products.products.length !== 1 && "s"} found
              </div>
            </div>

            <ProductGrid
              products={products}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onToggleDetails={toggleProductDetails}
              onEditProduct={handleEditProductButton}
              onDeleteProduct={onDeleteProduct}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      </div>

      {showAddModal && (
        <ProductModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddProduct}
         
        />
      )}

      {showEditModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onSave={handleEditProduct}
       
        />
      )}

      {selectedProductDetails && (
        <ProductModal
          product={selectedProductDetails}
          onClose={() => setSelectedProductDetails(null)}
          onSave={() => {}}
         
          readOnly
          onEdit={() => handleEditProductButton(selectedProductDetails)}
          onDelete={() => handleDeleteProduct(selectedProductDetails.id)}
        />
      )}
    </div>
  );
}
