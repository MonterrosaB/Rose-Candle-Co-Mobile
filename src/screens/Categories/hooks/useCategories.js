import { useState, useEffect, useCallback } from "react"; // Hooks de React para estado, efectos y memoización
import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Hooks de navegación y enfoque
import { Alert } from "react-native"; // Para mostrar alertas nativas

// URL base de la API de categorías de productos
const API = "https://rose-candle-co.onrender.com/api/productCategories";

export default function useCategories() {
  const [categories, setCategories] = useState([]); // Estado para almacenar las categorías
  const [loading, setLoading] = useState(true); // Estado de carga
  const [currentPage, setCurrentPage] = useState(1); // Página actual de la paginación
  const [deletingId, setDeletingId] = useState(null); // ID de la categoría que se está eliminando
  const navigation = useNavigation(); // Hook para navegar entre pantallas

  const itemsPerPage = 13; // Cantidad de categorías por página

  // Función para obtener las categorías desde la API
  const fetchCategories = async () => {
    try {
      setLoading(true); // Activamos indicador de carga
      const res = await fetch(API); // Llamada a la API
      const data = await res.json(); // Convertimos la respuesta a JSON
      setCategories(data); // Guardamos las categorías en el estado
    } catch (err) {
      console.error("Error fetching categories:", err); // Mostramos error en consola
    } finally {
      setLoading(false); // Desactivamos indicador de carga
    }
  };

  // Función para eliminar una categoría
  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar categoría", // Título alerta
      "¿Estás seguro?", // Mensaje alerta
      [
        { text: "Cancelar", style: "cancel" }, // Botón cancelar
        {
          text: "Eliminar", // Botón eliminar
          style: "destructive",
          onPress: async () => {
            setDeletingId(id); // Guardamos el ID que se está eliminando
            try {
              const res = await fetch(`${API}/${id}`, { method: "DELETE" }); // Llamada DELETE
              if (!res.ok) throw new Error("No se pudo eliminar"); // Error si no fue exitosa
              setCategories((prev) => prev.filter((c) => c._id !== id)); // Eliminamos la categoría del estado
              Alert.alert("Éxito", "Categoría eliminada."); // Mensaje de éxito
            } catch (err) {
              Alert.alert("Error", err.message); // Mostramos error si falla
            } finally {
              setDeletingId(null); // Limpiamos el ID de eliminación
              fetchCategories(); // Volvemos a cargar las categorías
            }
          },
        },
      ]
    );
  };

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []);

  // Recargar categorías cada vez que la pantalla reciba foco
  useFocusEffect(useCallback(() => { fetchCategories(); }, []));

  // Paginación
  const totalPages = Math.ceil(categories.length / itemsPerPage); // Total de páginas
  const paginatedData = categories.slice( // Datos que se mostrarán en la página actual
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Retornamos los datos y funciones que usarán los componentes
  return {
    categories: paginatedData, // Solo las categorías de la página actual
    loading, // Estado de carga
    currentPage, // Página actual
    setCurrentPage, // Función para cambiar de página
    totalPages, // Total de páginas
    deletingId, // ID de categoría en proceso de eliminación
    handleDelete, // Función para eliminar categoría
    navigation, // Navegación
  };
}
