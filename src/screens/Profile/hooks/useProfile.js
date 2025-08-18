import { useEffect } from "react";
import { useForm } from "react-hook-form"; // Hook para manejar formularios
import Toast from "react-native-toast-message"; // Para mostrar mensajes de éxito o error

// Endpoints de la API
const ApiAuth = "https://rose-candle-co.onrender.com/api/auth/verify";
const ApiEmployees = "https://rose-candle-co.onrender.com/api/employees";

// Hook personalizado para manejar el perfil de usuario
export const useProfile = () => {
  // Inicialización del formulario con react-hook-form
  const {
    register,      // Registrar campos del formulario
    handleSubmit,  // Función para manejar el submit
    reset,         // Resetear formulario
    setValue,      // Actualizar valores de campos
    getValues,     // Obtener valores actuales de campos
    formState: { isSubmitting }, // Estado de envío del formulario
  } = useForm({
    defaultValues: { // Valores por defecto del formulario
      id: "",
      name: "",
      surnames: "",
      phone: "",
      email: "",
      dui: "",
      user: "",
      password: "",
    },
  });

  // Registramos los campos para react-hook-form cuando el hook se monta
  useEffect(() => {
    register("id");
    register("name");
    register("surnames");
    register("phone");
    register("email");
    register("dui");
    register("user");
    register("password");
  }, [register]);

  // Función para obtener los datos del perfil desde la API
  const getProfile = async () => {
    try {
      console.log("Llamando a /verify para obtener perfil");
      const res = await fetch(ApiAuth, { credentials: "include" });
      console.log("fetch /verify status:", res.status);

      if (!res.ok) throw new Error("Error al verificar el usuario");

      const data = await res.json();
      console.log("data recibida de /verify:", data);

      // Obtenemos datos completos del empleado usando su id
      const empRes = await fetch(`${ApiEmployees}/${data.id}`);
      if (!empRes.ok) throw new Error("Error al cargar perfil completo");
      const empData = await empRes.json();
      console.log("Empleado completo:", empData);

      // Actualizamos los valores del formulario con los datos recibidos
      setValue("id", empData._id || empData.id || "");
      setValue("name", empData.name || "");
      setValue("surnames", empData.surnames || "");
      setValue("phone", empData.phone || "");
      setValue("email", empData.email || "");
      setValue("dui", empData.dui || "");
      setValue("user", empData.user || "");
      setValue("password", "**********"); // Ocultamos la contraseña
    } catch (error) {
      console.error("Error getProfile:", error);
      Toast.show({ type: "error", text1: "No se pudo cargar el perfil" });
    }
  };

  // Función para actualizar el perfil del usuario
  const updateProfile = async (data) => {
    try {
      const sendData = { ...data };
      if (sendData.password === "**********") delete sendData.password; // No enviamos la contraseña si no cambió

      const userId = getValues("id"); // Obtenemos el id del formulario
      console.log("Actualizando perfil con id:", userId);
      console.log("Datos enviados:", sendData);

      const res = await fetch(`${ApiEmployees}/${userId}`, {
        method: "PUT", // Método PUT para actualizar
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendData),
      });

      console.log("fetch PUT status:", res.status);

      if (!res.ok) throw new Error("Error al actualizar perfil");
      const result = await res.json();
      console.log("Perfil actualizado:", result);

      // Mostramos mensaje de éxito
      Toast.show({ type: "success", text1: "Perfil actualizado correctamente" });

      // Actualizamos el formulario con los datos actualizados
      setValue("id", result._id || result.id || "");
      setValue("name", result.name || "");
      setValue("surnames", result.surnames || "");
      setValue("phone", result.phone || "");
      setValue("email", result.email || "");
      setValue("dui", result.dui || "");
      setValue("user", result.user || "");
      setValue("password", "**********"); // Ocultamos la contraseña
    } catch (error) {
      console.error("Error updateProfile:", error);
      Toast.show({ type: "error", text1: "Error al guardar cambios" });
    }
  };

  // Cargar el perfil al montar el hook
  useEffect(() => {
    getProfile();
  }, []);

  // Retornamos todas las funciones y valores del hook para usar en la UI
  return {
    register,
    handleSubmit,
    updateProfile,
    isSubmitting,
    reset,
    setValue,
    getValues,
  };
};
