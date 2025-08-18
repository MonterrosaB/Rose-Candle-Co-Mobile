import { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

// Hook personalizado para manejar la lógica de categorías de materias primas
export default function useCategoriesMateria() {
  const [categories, setCategories] = useState([]); // Lista de categorías
  const [loading, setLoading] = useState(true); // Estado de carga
  const [currentPage, setCurrentPage] = useState(1); // Página actual para paginación
  const [deletingId, setDeletingId] = useState(null); // ID de categoría en proceso de eliminación
  const itemsPerPage = 13; // Cantidad de elementos por página
  const navigation = useNavigation(); // Navegación entre pantallas

  // Función para obtener las categorías desde la API
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

  // Se ejecuta una vez al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []);

  // Se ejecuta cada vez que la pantalla obtiene foco (react-navigation)
  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  // Función para eliminar una categoría con confirmación
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

              // Intentar parsear JSON, si falla, tomar texto plano
              let body;
              try {
                body = await res.json();
              } catch {
                body = await res.text();
              }

              if (res.ok) {
                // Filtra la categoría eliminada de la lista
                setCategories((prev) => prev.filter((c) => c._id !== id));
                Alert.alert("Eliminado", "La categoría ha sido eliminada.");
              } else {
                // Manejo detallado de errores
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
              fetchCategories(); // Refrescar lista después de eliminar
            }
          },
        },
      ]
    );
  };

  // Paginación
  const totalPages = Math.max(1, Math.ceil(categories.length / itemsPerPage));
  const paginatedData = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Retorna todos los datos y funciones necesarios para la UI
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
