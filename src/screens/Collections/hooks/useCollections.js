import { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

export function useCollections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const navigation = useNavigation();
  const itemsPerPage = 13;

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://rose-candle-co.onrender.com/api/collections");
      if (!res.ok) throw new Error("Error al obtener colecciones");
      const data = await res.json();
      setCollections(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo cargar colecciones");
    } finally {
      setLoading(false);
    }
  };

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
            setDeletingId(id);
            try {
              const res = await fetch(
                `https://rose-candle-co.onrender.com/api/collections/${id}`,
                { method: "DELETE" }
              );
              if (!res.ok) throw new Error("No se pudo eliminar colección");
              setCollections(prev => prev.filter(c => c._id !== id));
              Alert.alert("Eliminado", "La colección ha sido eliminada.");
            } catch (err) {
              Alert.alert("Error", err.message);
            } finally {
              setDeletingId(null);
              fetchCollections();
            }
          },
        },
      ]
    );
  };

  useEffect(() => { fetchCollections(); }, []);
  useFocusEffect(useCallback(() => { fetchCollections(); }, []));

  const totalPages = Math.ceil(collections.length / itemsPerPage);
  const paginatedData = collections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
