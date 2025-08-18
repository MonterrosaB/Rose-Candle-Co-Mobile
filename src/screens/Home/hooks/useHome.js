import { useState, useEffect } from "react";

const API_BASE = "https://rose-candle-co.onrender.com/api";

const useHome = () => {
  const [customerCount, setCustomerCount] = useState(0);
  const [latestCustomerCount, setLatestCustomerCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentMonthOrders, setCurrentMonthOrders] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [lowStockMaterials, setLowStockMaterials] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Clientes totales
        const customersRes = await fetch(`${API_BASE}/customers/count`);
        const customersData = await customersRes.json();
        setCustomerCount(customersData.count || 0);

        // Nuevos clientes del mes
        const latestCustomersRes = await fetch(`${API_BASE}/customers/countByMonth`);
        const latestCustomersData = await latestCustomersRes.json();
        setLatestCustomerCount(latestCustomersData.count || 0);

        // Pedidos totales y del mes
        const ordersRes = await fetch(`${API_BASE}/salesOrder/countTotal`);
        const ordersData = await ordersRes.json();
        setTotalOrders(ordersData.totalOrders || 0);
        setCurrentMonthOrders(ordersData.currentMonthOrders || 0);

        // Ingresos totales y mensuales
        const earningsRes = await fetch(`${API_BASE}/salesOrder/totalEarnings`);
        const earningsData = await earningsRes.json();
        setTotalEarnings(earningsData.totalEarnings || 0);
        setMonthlyEarnings(earningsData.monthlyEarnings || 0);

        // Materiales con bajo stock
        const lowStockRes = await fetch(`${API_BASE}/rawMaterials/lowStock`);
        const lowStockData = await lowStockRes.json();
        setLowStockMaterials(lowStockData || []);

        // Productos más vendidos
        const bestProductsRes = await fetch(`${API_BASE}/cart/bestSellingProducts`);
        const bestProductsData = await bestProductsRes.json();
        setBestSellingProducts(bestProductsData || []);
      } catch (err) {
        console.error("Error fetching home data:", err);
      }
    };

    fetchData();
  }, []);

  return {
    customerCount,
    latestCustomerCount,
    totalOrders,
    currentMonthOrders,
    totalEarnings,
    monthlyEarnings,
    lowStockMaterials,
    bestSellingProducts,
  };
};

export default useHome;
