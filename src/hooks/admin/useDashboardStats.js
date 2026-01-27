/**
 * useDashboardStats.js
 * Custom hook for fetching admin dashboard statistics
 * Gets real data from Firebase for products, orders, users, and revenue
 */

import { useState, useEffect } from "react";
import { fetchProducts } from "../../services/firebase/firebaseProductService";
import { fetchUsers } from "../../services/firebase/firebaseUserService";
import { getAllOrders } from "../../services/firebase/firebaseOrderService";
import { useAuth } from "../../context/AuthContext";

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    ordersToday: 0,
    registeredUsers: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products count
        const products = await fetchProducts();
        const totalProducts = products.length;

        // Fetch users count
        const users = await fetchUsers();
        const registeredUsers = users.length;

        // Fetch orders for today and monthly revenue
        let ordersToday = 0;
        let monthlyRevenue = 0;

        if (user) {
          const token = await user.getIdToken();
          const ordersData = await getAllOrders(token);

          if (ordersData && ordersData.orders) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const currentMonth = new Date();
            const firstDayOfMonth = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              1,
            );

            ordersData.orders.forEach((order) => {
              // Count orders from today
              const orderDate = new Date(order.createdAt);
              orderDate.setHours(0, 0, 0, 0);

              if (orderDate.getTime() === today.getTime()) {
                ordersToday++;
              }

              // Calculate monthly revenue
              if (
                new Date(order.createdAt) >= firstDayOfMonth &&
                new Date(order.createdAt) <= new Date()
              ) {
                // Sum total from all items in the order
                if (order.items && Array.isArray(order.items)) {
                  order.items.forEach((item) => {
                    const itemPrice = item.unitPrice || 0;
                    const quantity = item.quantity || 1;
                    monthlyRevenue += itemPrice * quantity;
                  });
                }
              }
            });
          }
        }

        setStats({
          totalProducts,
          ordersToday,
          registeredUsers,
          monthlyRevenue,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.message || "Error al cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  return { stats, loading, error };
};
