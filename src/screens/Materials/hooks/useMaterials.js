import { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";

export function useMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const itemsPerPage = 13;
  const navigation = useNavigation();

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://rose-candle-co.onrender.com/api/rawMaterials");
      const data = await res.json();
      setMaterials(data);
    } catch (err) {
      console.error("Error fetching materials:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar material",
      "¿Estás seguro de que quieres eliminar este material?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setDeletingId(id);
            try {
              const res = await fetch(
                `https://rose-candle-co.onrender.com/api/rawMaterials/${id}`,
                { method: "DELETE" }
              );

              let body;
              try {
                body = await res.json();
              } catch {
                body = await res.text();
              }

              if (res.ok) {
                setMaterials((prev) => prev.filter((m) => m._id !== id));
                Alert.alert("Eliminado", "El material ha sido eliminado.");
              } else {
                const errMsg = body?.message || body?.error || JSON.stringify(body) || `Respuesta del servidor: ${res.status}`;
                throw new Error(errMsg);
              }
            } catch (err) {
              console.error("Error eliminando material:", err);
              Alert.alert("Error", err.message || "No se pudo eliminar el material");
            } finally {
              setDeletingId(null);
              fetchMaterials();
            }
          },
        },
      ]
    );
  };

  useEffect(() => { fetchMaterials(); }, []);
  useFocusEffect(useCallback(() => { fetchMaterials(); }, []));

  const totalPages = Math.ceil(materials.length / itemsPerPage);
  const paginatedData = materials.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return {
    loading,
    materials: paginatedData,
    totalPages,
    currentPage,
    setCurrentPage,
    deletingId,
    handleDelete,
    navigation,
  };
}
