import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { Product } from '../types';
import { API_ENDPOINTS, SPREADSHEET_IDS } from '../utils/api';
import { parseCSV } from '../utils/helpers';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const url = `${API_ENDPOINTS.dgistart}/${SPREADSHEET_IDS.products}/gviz/tq?tqx=out:csv`;
      const response = await fetch(url);
      const csvText = await response.text();
      
      const rows = parseCSV(csvText);
      rows.shift(); // Remove header
      
      const productList: Product[] = rows.slice(2).map((row, index) => ({
        image: row[8] || '',
        description: row[9] || '',
        name: row[2] || '',
        code: row[1] || '',
        size: row[3] || '',
        stock: parseInt(row[4]) || 0,
        price: parseFloat(row[6]) || 0,
        unisex: row[10] || 'Unisex',
        originalIndex: index + 2,
      }));

      // Sort products: out of stock last, otherwise by original index
      productList.sort((a, b) => {
        if (a.stock === 0 && b.stock !== 0) return 1;
        if (a.stock !== 0 && b.stock === 0) return -1;
        return a.originalIndex - b.originalIndex;
      });

      setProducts(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    if (product.stock > 0) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const handleBuyNow = () => {
    navigate('/cart');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header showTrackingIcon showCartIcon />
      
      <main className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-2.5 px-5 pt-[100px] pb-5">
        {products.map((product, index) => (
          <ProductCard
            key={`${product.code}-${index}`}
            product={product}
            onClick={() => handleProductClick(product)}
          />
        ))}
      </main>

      <Footer />

      {/* WhatsApp button */}
      <a
        href="https://wa.me/+8801844291901?text=Hello%20I%20want%20to%20buy%20a%20product%20from%20Vitaglow%20Bangladesh"
        className="fixed bottom-5 right-5 bg-[#25d366] text-white rounded-full w-15 h-15 flex justify-center items-center text-3xl shadow-lg hover:opacity-90 transition-opacity z-[100000]"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fa-brands fa-whatsapp p-3.5"></i>
      </a>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
};

export default Home;
