// useProductDetail.js
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export function useProductDetail(product, navigation) {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [newImage, setNewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    availability: Boolean(product.availability),
    variant: Array.isArray(product.variant) ? product.variant : [],
    components: Array.isArray(product.components) ? product.components : [],
    recipe: Array.isArray(product.recipe) ? product.recipe : [],
    useForm: Array.isArray(product.useForm) ? product.useForm : [],
    idProductCategory: product.idProductCategory?._id || product.idProductCategory || "",
    idCollection: product.idCollection?._id || product.idCollection || "",
  });

  const imageUrl = newImage
    ? newImage.uri
    : Array.isArray(product.images)
    ? product.images[0]
    : product.images;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // categories
        const resCat = await fetch("https://rose-candle-co.onrender.com/api/productCategories");
        const textCat = await resCat.text();
        try {
          const dataCat = JSON.parse(textCat);
          setCategories(Array.isArray(dataCat) ? dataCat : []);
        } catch {
          console.error("Respuesta inválida para categorías:", textCat);
          setCategories([]);
        }

        // collections
        const resCol = await fetch("https://rose-candle-co.onrender.com/api/collections");
        const textCol = await resCol.text();
        try {
          const dataCol = JSON.parse(textCol);
          setCollections(Array.isArray(dataCol) ? dataCol : []);
        } catch {
          console.error("Respuesta inválida para colecciones:", textCol);
          setCollections([]);
        }
      } catch (error) {
        console.error("Error al cargar categorías o colecciones", error);
      }
    };

    fetchData();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.IMAGE, // acorde a tu versión (igual que tu código original)
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
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

  const handleSave = async () => {
    try {
      let response;
      if (newImage) {
        const form = new FormData();
        form.append("name", formData.name);
        form.append("description", formData.description);
        form.append("availability", formData.availability ? "true" : "false");
        form.append("idProductCategory", formData.idProductCategory);
        form.append("idCollection", formData.idCollection);
        form.append("variant", JSON.stringify(formData.variant));
        form.append("components", JSON.stringify(formData.components));
        form.append("recipe", JSON.stringify(formData.recipe));
        form.append("useForm", JSON.stringify(formData.useForm));
        form.append("image", {
          uri: newImage.uri,
          name: "product.jpg",
          type: "image/jpeg",
        });

        response = await fetch(
          `https://rose-candle-co.onrender.com/api/products/${product._id}`,
          {
            method: "PUT",
            body: form, // no definir Content-Type
          }
        );
      } else {
        const payload = {
          ...formData,
          availability: formData.availability ? "true" : "false",
        };

        response = await fetch(
          `https://rose-candle-co.onrender.com/api/products/${product._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      }

      const text = await response.text();
      console.log("Status:", response.status);
      console.log("Response:", text);

      if (!response.ok) throw new Error("Error al actualizar");

      Alert.alert("Éxito", "Producto actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo actualizar el producto");
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
  };
}
