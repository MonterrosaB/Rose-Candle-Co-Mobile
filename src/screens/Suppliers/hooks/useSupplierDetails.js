// Importamos useState para manejar estados en el hook
import { useState } from "react";
// Importamos hooks de navegación y rutas de React Navigation
import { useNavigation, useRoute } from "@react-navigation/native";
// Importamos Alert para mostrar mensajes emergentes en la app
import { Alert } from "react-native";

// Hook personalizado para manejar la lógica de los detalles de un proveedor
export const useSupplierDetails = () => {
  // Obtenemos el objeto de navegación para redirigir entre pantallas
  const navigation = useNavigation();
  // Obtenemos la ruta actual para acceder a parámetros pasados
  const route = useRoute();
  // Extraemos el proveedor recibido por parámetros (si existe)
  const supplier = route.params?.supplier || null;

  // Estado para el nombre del proveedor (si existe, se precarga)
  const [name, setName] = useState(supplier ? supplier.name : "");
  // Estado para el contacto del proveedor
  const [contact, setContact] = useState(supplier ? supplier.contact : "");
  // Estado para manejar el indicador de carga
  const [loading, setLoading] = useState(false);

  // Función que maneja el guardado de proveedor (crear o actualizar)
  const handleSave = async () => {
    // Validamos que los campos no estén vacíos
    if (!name.trim() || !contact.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    // Activamos el estado de carga
    setLoading(true);
    try {
      let res; // Variable para guardar la respuesta del fetch
      // Si el proveedor existe, hacemos una actualización (PUT)
      if (supplier) {
        res = await fetch(
          `https://rose-candle-co.onrender.com/api/suppliers/${supplier._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, contact }),
          }
        );
      } else {
        // Si no existe, creamos un nuevo proveedor (POST)
        res = await fetch("https://rose-candle-co.onrender.com/api/suppliers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, contact }),
        });
      }

      // Convertimos la respuesta en JSON
      const data = await res.json();
      // Si la respuesta es exitosa
      if (res.ok) {
        Alert.alert("Éxito", supplier ? "Proveedor actualizado." : "Proveedor agregado.");
        // Regresamos a la pantalla anterior
        navigation.goBack();
      } else {
        // Si falla, mostramos el mensaje de error del backend
        const errMsg = data?.message || data?.error || `Respuesta inesperada: ${res.status}`;
        throw new Error(errMsg);
      }
    } catch (err) {
      // Si ocurre un error en la petición, lo mostramos en consola y alerta
      console.error("Error guardando proveedor:", err);
      Alert.alert("Error", err.message || "No se pudo guardar el proveedor.");
    } finally {
      // Siempre desactivamos el loading al terminar
      setLoading(false);
    }
  };

  // Retornamos los estados y funciones para usarlos en el UI
  return {
    supplier,
    name,
    contact,
    loading,
    setName,
    setContact,
    handleSave,
  };
};
