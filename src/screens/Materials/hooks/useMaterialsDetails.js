import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export function useMaterialsDetails() {
  const navigationBack = useNavigation();
  const route = useRoute();
  const { material } = route.params || {}; // Si viene material, es edición
  const isNew = !material?._id; // Determina si es nuevo

  // Estados de los campos
  const [name, setName] = useState(material?.name || "");
  const [unit, setUnit] = useState(material?.unit || "");
  const [currentStock, setCurrentStock] = useState(material?.currentStock?.toString() || "");
  const [minimunStock, setMinimunStock] = useState(material?.minimunStock?.toString() || "");
  const [currentPrice, setCurrentPrice] = useState(material?.currentPrice?.toString() || "");
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
    { label: "Pieza", value: "piece" },
  ];

  // Cargar categorías y proveedores
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, provRes] = await Promise.all([
          fetch("https://rose-candle-co.onrender.com/api/rawMaterialCategories"),
          fetch("https://rose-candle-co.onrender.com/api/suppliers"),
        ]);
        const [catData, provData] = await Promise.all([catRes.json(), provRes.json()]);
        setCategorias(catData);
        setProveedores(provData);
      } catch (error) {
        console.error("Error cargando datos:", error);
        Alert.alert("Error", "No se pudieron cargar categorías o proveedores.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Guardar o agregar material
  const handleSave = async () => {
    if (!name || !unit || !currentStock || !minimunStock || !currentPrice || !category || !supplier) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const payload = {
        name,
        unit,
        currentStock: Number(currentStock),
        minimunStock: Number(minimunStock),
        currentPrice: Number(currentPrice),
        idRawMaterialCategory: category,
        idSupplier: supplier,
      };

      const url = isNew
        ? "https://rose-candle-co.onrender.com/api/rawMaterials" // POST para nuevo
        : `https://rose-candle-co.onrender.com/api/rawMaterials/${material._id}`; // PUT para editar

      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Error al guardar el material");
      }

      Alert.alert("Éxito", isNew ? "Material agregado correctamente." : "Material actualizado correctamente.");
      navigationBack.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  return {
    loading,
    name, setName,
    unit, setUnit,
    currentStock, setCurrentStock,
    minimunStock, setMinimunStock,
    currentPrice, setCurrentPrice,
    category, setCategory,
    supplier, setSupplier,
    categorias,
    proveedores,
    unidades,
    handleSave,
    navigationBack,
    material,
  };
}
