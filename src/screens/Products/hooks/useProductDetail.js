// useProductDetail.js
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert, Platform } from "react-native";

/**
 * Hook para pantalla de detalle/edición/creación de producto.
 * Normaliza tipos y prepara payload compatible con el backend.
 */

function normalizeUriForForm(uri) {
  if (!uri) return uri;
  if (Platform.OS === "android") return uri;
  return uri.replace("file://", "");
}

function safeParseJSON(val) {
  if (val === undefined || val === null) return val;
  if (typeof val !== "string") return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return null;
  }
}

export function useProductDetail(product = null, navigation, isNewFlag = false) {
  const isNew = isNewFlag || !product || !product._id;

  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    name: "",
    description: "",
    availability: true,
    variant: [],
    components: [],
    recipe: [],
    useForm: [],
    idProductCategory: "",
    idCollection: "",
  };

  const [formData, setFormData] = useState(
    isNew
      ? emptyForm
      : {
          name: product?.name || "",
          description: product?.description || "",
          availability: Boolean(product?.availability),
          variant: Array.isArray(product?.variant) ? product.variant : [],
          components: Array.isArray(product?.components) ? product.components : [],
          recipe: Array.isArray(product?.recipe) ? product.recipe : [],
          useForm: Array.isArray(product?.useForm) ? product.useForm : [],
          idProductCategory: product?.idProductCategory?._id || product?.idProductCategory || "",
          idCollection: product?.idCollection?._id || product?.idCollection || "",
        }
  );

  const imageUrl =
    newImage?.uri ||
    (Array.isArray(product?.images) ? product.images[0] : product?.images) ||
    "https://via.placeholder.com/600x400.png?text=Sin+imagen";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCat = await fetch("https://rose-candle-co.onrender.com/api/productCategories");
        const txtCat = await resCat.text();
        try {
          const dataCat = JSON.parse(txtCat);
          setCategories(Array.isArray(dataCat) ? dataCat : []);
        } catch {
          setCategories([]);
        }

        const resCol = await fetch("https://rose-candle-co.onrender.com/api/collections");
        const txtCol = await resCol.text();
        try {
          const dataCol = JSON.parse(txtCol);
          setCollections(Array.isArray(dataCol) ? dataCol : []);
        } catch {
          setCollections([]);
        }
      } catch (err) {
        console.error("Error cargando categorías/colecciones:", err);
      }
    };

    fetchData();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setNewImage(result.assets[0]);
      }
    } catch (e) {
      console.error("Error al seleccionar imagen:", e);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (field, index, key, value) => {
    const updated = Array.isArray(formData[field]) ? [...formData[field]] : [];
    if (!updated[index]) return;
    updated[index] = { ...updated[index], [key]: value };
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const addArrayItem = (field, item) => {
    setFormData((prev) => ({ ...prev, [field]: [...(prev[field] || []), item] }));
  };

  const removeArrayItem = (field, index) => {
    const updated = Array.isArray(formData[field]) ? [...formData[field]] : [];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const isFormValid = () => {
    return (
      formData.name && formData.name.trim().length >= 3 &&
      formData.description && formData.description.trim().length >= 5 &&
      !!formData.idProductCategory &&
      Array.isArray(formData.variant) && formData.variant.length > 0
    );
  };

  const normalizePayloadForSend = () => {
    const payload = { ...formData };

    // Variantes
    payload.variant = Array.isArray(payload.variant)
      ? payload.variant.map((v) => ({
          variant: v?.variant ?? "",
          variantPrice: Number(v?.variantPrice) || 0,
          components: Array.isArray(v.components)
            ? v.components.map((c) => ({
                idComponent: typeof c.idComponent === "object" ? c.idComponent._id : c.idComponent || "",
                amount: Number(c.amount) || 0,
              }))
            : [],
        }))
      : [];

    // Components top-level
    payload.components = Array.isArray(payload.components)
      ? payload.components.map((c) => ({
          idComponent: typeof c.idComponent === "object" ? c.idComponent._id : c.idComponent || "",
          amount: Number(c.amount) || 0,
        }))
      : [];

    // Recipe y useForm
    payload.recipe = Array.isArray(payload.recipe)
      ? payload.recipe.map((r) => (typeof r === "string" ? { step: r } : r))
      : [];

    payload.useForm = Array.isArray(payload.useForm)
      ? payload.useForm.map((u) => (typeof u === "string" ? { instruction: u } : u))
      : [];

    // Availability
    payload.availability = payload.availability ? "true" : "false";

    // Solo enviar ID para categoría y colección
    payload.idProductCategory = typeof payload.idProductCategory === "object"
      ? payload.idProductCategory._id
      : payload.idProductCategory;

    payload.idCollection = typeof payload.idCollection === "object"
      ? payload.idCollection._id
      : payload.idCollection;

    return payload;
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      Alert.alert("Formulario incompleto", "Completa nombre, descripción, categoría y al menos una variante.");
      return;
    }

    setSaving(true);
    try {
      const payload = normalizePayloadForSend();

      let response;
      if (newImage) {
        const form = new FormData();
        form.append("name", payload.name);
        form.append("description", payload.description);
        form.append("availability", payload.availability);
        form.append("idProductCategory", payload.idProductCategory);
        form.append("idCollection", payload.idCollection);
        form.append("variant", JSON.stringify(payload.variant));
        form.append("components", JSON.stringify(payload.components));
        form.append("recipe", JSON.stringify(payload.recipe));
        form.append("useForm", JSON.stringify(payload.useForm));

        const uri = normalizeUriForForm(newImage.uri);
        form.append("images", {
          uri,
          name: newImage.fileName || "product.jpg",
          type: newImage.type || "image/jpeg",
        });

        if (isNew) {
          response = await fetch("https://rose-candle-co.onrender.com/api/products", {
            method: "POST",
            body: form,
          });
        } else {
          response = await fetch(`https://rose-candle-co.onrender.com/api/products/${product._id}`, {
            method: "PUT",
            body: form,
          });
        }
      } else {
        const body = {
          ...payload,
          variant: JSON.stringify(payload.variant),
          components: JSON.stringify(payload.components),
          recipe: JSON.stringify(payload.recipe),
          useForm: JSON.stringify(payload.useForm),
          changedBy: "frontend",
        };

        if (isNew) {
          response = await fetch("https://rose-candle-co.onrender.com/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        } else {
          response = await fetch(`https://rose-candle-co.onrender.com/api/products/${product._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        }
      }

      const text = await response.text();
      let parsed;
      try { parsed = JSON.parse(text); } catch { parsed = null; }

      console.log("Status:", response.status);
      console.log("Response:", parsed ?? text);

      if (!response.ok) {
        const msg = parsed?.message || parsed?.error || text || `Error ${response.status}`;
        throw new Error(msg);
      }

      Alert.alert("Éxito", isNew ? "Producto creado correctamente" : "Producto actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("save error:", error);
      Alert.alert("Error", String(error.message || "No se pudo guardar el producto"));
    } finally {
      setSaving(false);
    }
  };

  return {
    categories,
    collections,
    formData,
    imageUrl,
    pickImage,
    updateField,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    handleSave,
    goBack: () => navigation.goBack(),
    isNew,
    saving,
    isFormValid: isFormValid(),
  };
}
