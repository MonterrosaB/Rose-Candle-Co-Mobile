import { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

// Hook personalizado para manejar la lista de colecciones
export function useCollections() {
  // Estado de todas las colecciones obtenidas de la API
  const [collections, setCollections] = useState([]);
  // Estado de carga para mostrar indicadores mientras se obtiene la información
  const [loading, setLoading] = useState(true);
  // Página actual para paginación
  const [currentPage, setCurrentPage] = useState(1);
  // ID de colección que se está eliminando (para mostrar indicador si es necesario)
  const [deletingId, setDeletingId] = useState(null);

  const navigation = useNavigation(); // Para navegación entre pantallas
  const itemsPerPage = 13; // Cantidad de colecciones por página

  // Función para obtener colecciones desde la API
  const fetchCollections = async () => {
    try {
      setLoading(true); // Activamos indicador de carga
      const res = await fetch("https://rose-candle-co.onrender.com/api/collections");
      if (!res.ok) throw new Error("Error al obtener colecciones");
      const data = await res.json();
      setCollections(data); // Guardamos las colecciones obtenidas
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo cargar colecciones"); // Mensaje de error
    } finally {
      setLoading(false); // Desactivamos indicador de carga
    }
  };

  // Función para eliminar una colección
  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar colección",
      "¿Estás seguro de que quieres eliminar esta colección?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setDeletingId(id); // Indicamos que esta colección se está eliminando
            try {
              const res = await fetch(
                `https://rose-candle-co.onrender.com/api/collections/${id}`,
                { method: "DELETE" }
              );
              if (!res.ok) throw new Error("No se pudo eliminar colección");

              // Eliminamos la colección localmente sin recargar toda la lista
              setCollections(prev => prev.filter(c => c._id !== id));
              Alert.alert("Eliminado", "La colección ha sido eliminada.");
            } catch (err) {
              Alert.alert("Error", err.message); // Mostrar error si falla
            } finally {
              setDeletingId(null); // Limpiamos el estado de eliminación
              fetchCollections(); // Recargamos la lista para mantenerla actualizada
            }
          },
        },
      ]
    );
  };

  // Ejecutamos fetchCollections al montar el componente
  useEffect(() => { fetchCollections(); }, []);

  // Ejecutamos fetchCollections cada vez que la pantalla recibe foco
  useFocusEffect(useCallback(() => { fetchCollections(); }, []));

  // Calculamos la cantidad total de páginas según itemsPerPage
  const totalPages = Math.ceil(collections.length / itemsPerPage);
  // Extraemos solo los elementos de la página actual
  const paginatedData = collections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Retornamos todo lo necesario para la UI
  return {
    collections,
    loading,
    deletingId,
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage,
    navigation,
    handleDelete,
  };
}
