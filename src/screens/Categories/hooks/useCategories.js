import { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const API = "https://rose-candle-co.onrender.com/api/productCategories";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const navigation = useNavigation();

  const itemsPerPage = 13;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar categoría",
      "¿Estás seguro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setDeletingId(id);
            try {
              const res = await fetch(`${API}/${id}`, { method: "DELETE" });
              if (!res.ok) throw new Error("No se pudo eliminar");
              setCategories((prev) => prev.filter((c) => c._id !== id));
              Alert.alert("Éxito", "Categoría eliminada.");
            } catch (err) {
              Alert.alert("Error", err.message);
            } finally {
              setDeletingId(null);
              fetchCategories();
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useFocusEffect(useCallback(() => { fetchCategories(); }, []));

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedData = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    categories: paginatedData,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    deletingId,
    handleDelete,
    navigation
  };
}
