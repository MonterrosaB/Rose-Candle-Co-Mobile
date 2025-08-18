import { useEffect, useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const itemsPerPage = 13;
  const navigation = useNavigation();

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://rose-candle-co.onrender.com/api/suppliers");
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSuppliers();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar proveedor",
      "¿Estás seguro de que quieres eliminar este proveedor?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setDeletingId(id);
            try {
              const res = await fetch(
                `https://rose-candle-co.onrender.com/api/suppliers/${id}`,
                { method: "DELETE" }
              );
              let body;
              try {
                body = await res.json();
              } catch {
                body = await res.text();
              }
              if (res.ok) {
                setSuppliers((prev) => prev.filter((s) => s._id !== id));
                Alert.alert("Eliminado", "El proveedor ha sido eliminado.");
              } else {
                const errMsg =
                  body.message || body.error || `Respuesta del servidor: ${res.status}`;
                throw new Error(errMsg);
              }
            } catch (err) {
              console.error("Error eliminando proveedor:", err);
              Alert.alert("Error", err.message || "No se pudo eliminar el proveedor");
            } finally {
              setDeletingId(null);
              fetchSuppliers();
            }
          },
        },
      ]
    );
  };

  const totalPages = Math.max(1, Math.ceil(suppliers.length / itemsPerPage));
  const paginatedData = suppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    suppliers,
    loading,
    currentPage,
    deletingId,
    totalPages,
    paginatedData,
    setCurrentPage,
    handleDelete,
    navigation,
  };
};
