// Importamos React y varios hooks necesarios
import React, { createContext, useState, useCallback, useEffect, useContext } from "react";
// Importamos ToastAndroid para mostrar notificaciones en Android (mensajes tipo "snackbar")
import { ToastAndroid } from "react-native";
// Importamos AsyncStorage para guardar información de sesión localmente en el dispositivo
import AsyncStorage from "@react-native-async-storage/async-storage";

// Creamos un contexto de autenticación para que cualquier componente en la app pueda acceder
// a la información de usuario sin necesidad de pasar props manualmente
const AuthContext = createContext(null);
export { AuthContext };

// Hook personalizado para usar el contexto más fácilmente en cualquier componente
export const useAuth = () => useContext(AuthContext);

// Componente proveedor que encapsula toda la lógica de autenticación
export const AuthProvider = ({ children }) => {
  // Estado del usuario actualmente autenticado (null si no hay sesión)
  const [user, setUser] = useState(null);
  // Estado que indica si hay un token válido (true) o no (false)
  const [authToken, setAuthToken] = useState(false);
  // Estado de carga (ejemplo: podrías usarlo para mostrar un loader durante login/logout)
  const [loading, setLoading] = useState(false);
  // URL base de la API backend
  const API_URL = "https://rose-candle-co.onrender.com/api";

  /**
   * LOGIN
   * Función asincrónica que intenta autenticar un usuario con username y password
   * Hace un POST a la API y guarda el token en AsyncStorage si la respuesta es correcta
   */
  const login = async (username, password) => {
    try {
      // Petición al backend con las credenciales
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: username, password }), // enviamos el user y password
        credentials: "include", // importante para manejar cookies
      });

      // Capturamos la respuesta como texto primero
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text); // Intentamos parsear como JSON
      } catch {
        data = { message: text }; // Si no es JSON, lo guardamos como mensaje plano
      }

      console.log("Login response:", data);

      if (response.ok) {
        // Si la respuesta es correcta y tenemos token
        if (data.token) {
          // Guardamos el token en AsyncStorage para persistencia
          await AsyncStorage.setItem("token", data.token);
        }

        setAuthToken(true); // Marcamos que sí hay sesión

        // Verificamos el token en el backend
        const verifyRes = await fetch(`${API_URL}/auth/verify`, { credentials: "include" });
        const verifyData = await verifyRes.json();

        // Pedimos los datos completos del empleado
        const empRes = await fetch(`${API_URL}/employees/${verifyData.id}`);
        const empData = await empRes.json();

        console.log("Empleado completo:", empData);

        // Guardamos la información del usuario autenticado en estado
        setUser({
          id: empData._id,
          name: empData.name,
          surnames: empData.surnames,
          user: empData.user,
          email: empData.email,
          phone: empData.phone,
        });

        // También lo guardamos en AsyncStorage (persistente en el dispositivo)
        await AsyncStorage.setItem("user", JSON.stringify(empData));

        // Mostramos notificación en Android
        ToastAndroid.show("Inicio de sesión exitoso", ToastAndroid.SHORT);
        return true;
      } else {
        // Si hay error de credenciales o respuesta incorrecta
        ToastAndroid.show(data.message || "Error al iniciar sesión", ToastAndroid.SHORT);
        return false;
      }
    } catch (error) {
      // Si ocurre error de red, backend caído, etc.
      console.error("Error during login:", error);
      ToastAndroid.show("Error de conexión con el servidor", ToastAndroid.SHORT);
      return false;
    }
  };

  /**
   * LOGOUT
   * Función asincrónica para cerrar sesión
   * Borra datos de AsyncStorage, resetea estados, y opcionalmente navega al Login
   */
  const logout = useCallback(async (navigation) => {
    try {
      // Intentamos avisar al backend que cerramos sesión
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Limpiamos estados de sesión
      setUser(null);
      setAuthToken(false);
      await AsyncStorage.multiRemove(["token", "user"]);

      // Mostramos mensaje de éxito
      ToastAndroid.show("Sesión cerrada correctamente", ToastAndroid.SHORT);

      // Si hay navegación disponible, redirigimos a la pantalla de Login
      if (navigation) {
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginStack" }],
        });
      }
    }
  }, [API_URL]);

  /**
   * RESTORE SESSION
   * Revisa si existe un token en AsyncStorage y lo valida contra el backend
   * Sirve para mantener al usuario logueado incluso después de cerrar la app
   */
  const restoreSession = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return; // Si no hay token, no hay sesión

      // Validamos el token contra el backend
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setAuthToken(true);
        setUser({
          id: data.user?.id,
          name: data.user?.name || data.user?.user || "Invitado", // fallback por si falta info
        });
      } else {
        // Si el token no es válido, limpiamos todo
        await AsyncStorage.multiRemove(["token", "user"]);
        setUser(null);
        setAuthToken(false);
      }
    } catch (err) {
      console.error("Restore session error:", err);
      setUser(null);
      setAuthToken(false);
    }
  };

  // useEffect que se ejecuta al montar el componente
  // Intenta restaurar sesión automáticamente
  useEffect(() => {
    restoreSession();
  }, []);

  // Retornamos el proveedor con todos los valores y funciones disponibles
  // Ahora cualquier componente puede acceder a { user, login, logout, etc. }
  return (
    <AuthContext.Provider
      value={{ user, authToken, loading, login, logout, API: API_URL }}
    >
      {children}
    </AuthContext.Provider>
  );
};
