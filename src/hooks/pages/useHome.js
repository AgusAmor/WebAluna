/**
 * useHome.js
 * Custom hook for managing home page state and carousel logic.
 * Encapsulates product loading and carousel animation.
 */

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  loadFeaturedProducts,
  getCarouselConfig,
  duplicateProductsForCarousel,
} from "../../services/ui/homeService";

export function useHome() {
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load featured products on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const fetched = await loadFeaturedProducts();
        setProducts(fetched);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Infinite carousel animation effect
  useEffect(() => {
    if (loading || error || products.length === 0) return;

    const carousel = carouselRef.current;
    if (!carousel) return;

    const { scrollSpeed, resetPoint } = getCarouselConfig(products.length);
    let scrollPos = 0;
    let animationId = null;

    /**
     * Scroll animation function using requestAnimationFrame.
     * Creates seamless infinite loop by resetting scroll position.
     */
    const scroll = () => {
      scrollPos += scrollSpeed;

      // Reset scroll position when reaching the end for seamless loop
      if (scrollPos >= resetPoint) {
        scrollPos = 0;
      }

      carousel.style.transform = `translateX(-${scrollPos}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    // Cleanup: Cancel animation frame on unmount
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [products, loading, error]);

  /**
   * Navigate to products catalog with optional product pre-selection
   * @param {Object} product - Product to open in catalog modal
   */
  const handleProductClick = (product) => {
    navigate("/productos", { state: { openProduct: product } });
  };

  /**
   * Navigate to products catalog page
   */
  const handleGoToCatalog = () => {
    navigate("/productos");
  };

  // Duplicate products for infinite carousel effect
  const carouselProducts = duplicateProductsForCarousel(products);

  return {
    carouselRef,
    products,
    carouselProducts,
    loading,
    error,
    handleProductClick,
    handleGoToCatalog,
  };
}
