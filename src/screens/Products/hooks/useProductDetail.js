import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export const useProductDetail = (product, navigation) => {
  const API = "https://rose-candle-co.onrender.com/api/products";
  const API_CATEGORIES = "https://rose-candle-co.onrender.com/api/productCategories";
  const API_COLLECTIONS = "https://rose-candle-co.onrender.com/api/collections";
  const API_RAW = "https://rose-candle-co.onrender.com/api/rawMaterials";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [],
    recipe: [],
    useForm: [],
    variant: [],
    availability: true,
    idProductCategory: "",
    idCollection: "",
  });
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [saving, setSaving] = useState(false);

  // Traer categorías, colecciones y materias primas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, colsRes, rawRes] = await Promise.all([
          axios.get(API_CATEGORIES),
          axios.get(API_COLLECTIONS),
          axios.get(API_RAW),
        ]);
        setCategories(catsRes.data || []);
        setCollections(colsRes.data || []);
        setRawMaterials(rawRes.data || []);
      } catch (err) {
        console.error("Error cargando datos:", err.message);
      }
    };
    fetchData();
  }, []);

  // Cargar datos del producto si existe
  useEffect(() => {
    if (product) {
      const variants = (product.variant || []).map((v) => ({
        ...v,
        components: (v.components || []).map((c) => ({
          idComponent: c.idComponent?._id || c.idComponent || "",
          name: c.idComponent?.name || c.name || "",
          amount: c.amount || 0,
        })),
      }));

      setFormData({
        name: product.name || "",
        description: product.description || "",
        images: product.images || [],
        recipe: (product.recipe || []).map((r) => ({ step: r.step || "" })),
        useForm: (product.useForm || []).map((u) => ({ step: u.instruction || "" })),
        variant: variants,
        availability: product.availability ?? true,
        idProductCategory: product.idProductCategory?._id || product.idProductCategory || "",
        idCollection: product.idCollection?._id || product.idCollection || "",
      });
    }
  }, [product]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (arrayName, index, key, value) => {
    setFormData((prev) => {
      const copy = [...prev[arrayName]];
      copy[index] = { ...copy[index], [key]: value };
      return { ...prev, [arrayName]: copy };
    });
  };

  const addArrayItem = (arrayName, item) => {
    setFormData((prev) => ({ ...prev, [arrayName]: [...prev[arrayName], item] }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const updateVariantComponent = (variantIndex, componentIndex, key, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variant];
      const newComponents = [...(newVariants[variantIndex].components || [])];

      if (key === "idComponent") {
        const selectedRaw = rawMaterials.find((r) => r._id === value);
        newComponents[componentIndex] = {
          ...newComponents[componentIndex],
          idComponent: selectedRaw?._id || "",
          name: selectedRaw?.name || "",
        };
      } else {
        newComponents[componentIndex] = { ...newComponents[componentIndex], [key]: value };
      }

      newVariants[variantIndex] = { ...newVariants[variantIndex], components: newComponents };
      return { ...prev, variant: newVariants };
    });
  };

  const addArrayItemToVariant = (variantIndex, item) => {
    setFormData((prev) => {
      const newVariants = [...prev.variant];
      newVariants[variantIndex].components = [
        ...(newVariants[variantIndex].components || []),
        item,
      ];
      return { ...prev, variant: newVariants };
    });
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setFormData((prev) => ({ ...prev, images: [...prev.images, result.assets[0].uri] }));
      }
    } catch (err) {
      console.error("Error al seleccionar imagen:", err);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    try {
      const missingFields = [];
      if (!formData.name.trim()) missingFields.push("Nombre");
      if (!formData.description.trim()) missingFields.push("Descripción");
      if (!formData.idProductCategory) missingFields.push("Categoría");

      const validVariants = formData.variant.filter(
        (v) =>
          v.variant &&
          v.variant.trim() !== "" &&
          v.variantPrice != null &&
          Array.isArray(v.components) &&
          v.components.every((c) => c.idComponent && c.amount > 0)
      );

      if (validVariants.length === 0) missingFields.push("Variantes");

      if (missingFields.length > 0) {
        Alert.alert(
          "Campos faltantes",
          `Por favor completa los siguientes campos:\n${missingFields.join(", ")}`
        );
        return;
      }

      setSaving(true);

      const validRecipe = formData.recipe.filter((r) => r.step && r.step.trim() !== "");
      const validUseForm = formData.useForm.filter((u) => u.step && u.step.trim() !== "");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("availability", formData.availability.toString());
      data.append("idProductCategory", formData.idProductCategory);
      data.append("idCollection", formData.idCollection);
      data.append("variant", JSON.stringify(validVariants));
      data.append("recipe", JSON.stringify(validRecipe));
      data.append(
        "useForm",
        JSON.stringify(validUseForm.map((u) => ({ instruction: u.step })))
      );

      formData.images.forEach((uri, index) => {
        if (!uri.startsWith("http")) {
          data.append("images", {
            uri,
            name: `image_${index}.jpg`,
            type: "image/jpeg",
          });
        }
      });
      const existingImages = formData.images.filter((uri) => uri.startsWith("http"));
      data.append("imagesExisting", JSON.stringify(existingImages));

      let res;
      if (product) {
        res = await axios.put(`${API}/${product._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post(API, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      Alert.alert("✅ Éxito", res.data.message || "Guardado correctamente");
      navigation.goBack();
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert(
        "❌ Error",
        error.response?.data?.message || "No se pudo guardar el producto"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product?._id) return;

    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro que quieres eliminar este producto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setSaving(true);
              await axios.delete(`${API}/${product._id}`);
              Alert.alert("✅ Éxito", "Producto eliminado correctamente");
              navigation.goBack();
            } catch (error) {
              console.error(error.response?.data || error.message);
              Alert.alert("❌ Error", error.response?.data?.message || "No se pudo eliminar");
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  return {
    formData,
    saving,
    categories,
    collections,
    rawMaterials,
    updateField,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    updateVariantComponent,
    addArrayItemToVariant,
    pickImage,
    removeImage,
    handleSave,
    handleDelete,
    goBack: () => navigation.goBack(),
    isNew: !product,
    isFormValid: !!formData.name && !!formData.description && !!formData.idProductCategory,
  };
};
