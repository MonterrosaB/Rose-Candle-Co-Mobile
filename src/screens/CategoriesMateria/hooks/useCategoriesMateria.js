import { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

export default function useCategoriesMateria() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const itemsPerPage = 13;
  const navigation = useNavigation();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://rose-candle-co.onrender.com/api/rawmaterialcategories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar categoría",
      "¿Estás seguro de que quieres eliminar esta categoría?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setDeletingId(id);
            try {
              const res = await fetch(
                `https://rose-candle-co.onrender.com/api/rawmaterialcategories/${id}`,
                { method: "DELETE" }
              );
              let body;
              try {
                body = await res.json();
              } catch {
                body = await res.text();
              }
              if (res.ok) {
                setCategories((prev) => prev.filter((c) => c._id !== id));
                Alert.alert("Eliminado", "La categoría ha sido eliminada.");
              } else {
                const errMsg =
                  (body && (body.message || body.error || JSON.stringify(body))) ||
                  `Respuesta del servidor: ${res.status}`;
                throw new Error(errMsg);
              }
            } catch (err) {
              console.error("Error eliminando categoría:", err);
              Alert.alert("Error", err.message || "No se pudo eliminar la categoría");
            } finally {
              setDeletingId(null);
              fetchCategories();
            }
          },
        },
      ]
    );
  };

  const totalPages = Math.max(1, Math.ceil(categories.length / itemsPerPage));
  const paginatedData = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    categories,
    loading,
    currentPage,
    totalPages,
    paginatedData,
    deletingId,
    setCurrentPage,
    handleDelete,
    navigation,
  };
}
