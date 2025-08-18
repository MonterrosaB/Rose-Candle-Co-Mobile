import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export function useMaterialsDetails({ route, navigation }) {
  const { material } = route.params || {};
  const navigationBack = useNavigation();

  const [name, setName] = useState(material?.name || "");
  const [unit, setUnit] = useState(material?.unit || "");
  const [currentStock, setCurrentStock] = useState(String(material?.currentStock || ""));
  const [currentPrice, setCurrentPrice] = useState(String(material?.currentPrice || ""));
  const [category, setCategory] = useState(material?.idRawMaterialCategory?._id || "");
  const [supplier, setSupplier] = useState(material?.idSupplier?._id || "");

  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const unidades = [
    { label: "Kilogramo", value: "kg" },
    { label: "Gramo", value: "g" },
    { label: "Litro", value: "l" },
    { label: "Mililitro", value: "ml" },
    { label: "Pieza", value: "pieza" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch("https://rose-candle-co.onrender.com/api/rawMaterialCategories");
        const catData = await catRes.json();
        setCategorias(catData);

        const provRes = await fetch("https://rose-candle-co.onrender.com/api/suppliers");
        const provData = await provRes.json();
        setProveedores(provData);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const updatedFields = {
        name: name || material.name,
        unit: unit || material.unit,
        currentStock: Number(currentStock ?? material.currentStock),
        currentPrice: Number(currentPrice ?? material.currentPrice),
        idRawMaterialCategory: category || material.idRawMaterialCategory?._id,
        idSupplier: supplier || material.idSupplier?._id,
      };

      const res = await fetch(
        `https://rose-candle-co.onrender.com/api/rawMaterials/${material._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
        }
      );

      if (!res.ok) throw new Error("Error al guardar");

      Alert.alert("Guardado", "Los cambios han sido guardados.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return {
    loading,
    name, setName,
    unit, setUnit,
    currentStock, setCurrentStock,
    currentPrice, setCurrentPrice,
    category, setCategory,
    supplier, setSupplier,
    categorias,
    proveedores,
    unidades,
    navigationBack,
    handleSave,
    navigation
  };
}
