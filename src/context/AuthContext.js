// AuthContext.jsx
import React, { createContext, useState, useCallback, useEffect, useContext } from "react";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);
export { AuthContext };
export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider adaptado para tu backend:
 * - No persiste token (no guarda automáticamente).
 * - Usa /api/auth/verifyEmployee para verificar sesión cookie-based.
 * - Parseo seguro de respuestas (evita JSON.parse sobre HTML).
 */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(false); // indica sesión activa en la app
  const [loading, setLoading] = useState(false);

  const API_URL = "https://rose-candle-co.onrender.com/api";

  // Helper: parsea respuesta si es JSON, si no devuelve {_raw: text}
  const parseResponseSafely = async (res) => {
    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();
    if (contentType.includes("application/json")) {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.warn("parseResponseSafely: JSON parse failed, returning raw text.", e);
        return { _raw: text };
      }
    }
    return { _raw: text };
  };

  // Intenta verificar sesión de empleado en /auth/verifyEmployee (cookie-based)
  const verifyEmployeeSafe = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/verifyEmployee`, {
        credentials: "include", // necesario si backend setea cookie
      });
      console.log("/auth/verifyEmployee status:", res.status, "ct:", res.headers.get("content-type"));
      if (!res.ok) {
        const txt = await res.text();
        console.warn("/auth/verifyEmployee non-ok:", res.status, txt);
        return null;
      }
      const parsed = await parseResponseSafely(res);
      return parsed;
    } catch (err) {
      console.warn("verifyEmployeeSafe error:", err);
      return null;
    }
  };

  /**
   * LOGIN
   * - No guardamos token por diseño.
   * - Si el /login devuelve id usamos ese id, si no probamos /auth/verifyEmployee.
   */
  const login = async (username, password) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: username, password }),
        credentials: "include", // para recibir cookie si backend setea sesión por cookie
      });

      const data = await parseResponseSafely(response);
      console.log("Login response raw/parsed:", data, "status:", response.status, "ct:", response.headers.get("content-type"));

      if (!response.ok) {
        const msg = data?.message || data?._raw || "Error al iniciar sesión";
        ToastAndroid.show(msg, ToastAndroid.SHORT);
        setLoading(false);
        return false;
      }

      // No persistimos token por diseño. Si backend devolviera token, lo ignoramos (o puedes cambiar).
      if (data.token) {
        console.log("Login devolvió token, pero config indicó no persistirlo.");
      }

      // Intentamos obtener userId directamente desde /login (si lo devuelve)
      let userId = data?.id || data?._id || data?.user?.id || data?.employeeId;

      // Si no hay id, intentamos verificar con /auth/verifyEmployee (cookie-based)
      if (!userId) {
        const verify = await verifyEmployeeSafe();
        userId = verify?.id || verify?._id;
      }

      // Si tenemos userId, pedimos datos completos del empleado
      if (userId) {
        try {
          const empRes = await fetch(`${API_URL}/employees/${userId}`, {
            credentials: "include",
          });
          if (!empRes.ok) {
            const empTxt = await empRes.text();
            console.warn("employees/:id returned non-OK:", empRes.status, empTxt);
          } else {
            const empParsed = await parseResponseSafely(empRes);
            let emp;
            if (empParsed._raw) {
              try {
                emp = JSON.parse(empParsed._raw);
              } catch {
                console.warn("employees/:id devolvió _raw no-JSON:", empParsed._raw);
                emp = null;
              }
            } else {
              emp = empParsed;
            }
            if (emp) {
              setUser({
                id: emp._id || emp.id,
                name: emp.name,
                surnames: emp.surnames,
                user: emp.user,
                email: emp.email,
                phone: emp.phone,
              });
              // No guardamos user en AsyncStorage para respetar no-persistencia.
            }
          }
        } catch (e) {
          console.warn("Error fetching employee data:", e);
        }
      } else {
        console.log("No se obtuvo userId desde /login ni /auth/verifyEmployee. Se asumirá sesión por cookie si el backend la setea.");
      }

      setAuthToken(true);
      ToastAndroid.show("Inicio de sesión exitoso", ToastAndroid.SHORT);
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error durante login:", error);
      ToastAndroid.show("Error de conexión con el servidor", ToastAndroid.SHORT);
      setLoading(false);
      return false;
    }
  };

  /**
   * LOGOUT
   */
  const logout = useCallback(
    async (navigation) => {
      try {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Error during logout:", error);
      } finally {
        setUser(null);
        setAuthToken(false);
        try {
          await AsyncStorage.multiRemove(["token", "user"]);
        } catch (e) {
          console.warn("Error clearing AsyncStorage on logout:", e);
        }
        ToastAndroid.show("Sesión cerrada correctamente", ToastAndroid.SHORT);
        if (navigation) {
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginStack" }],
          });
        }
      }
    },
    [API_URL]
  );

  /**
   * RESTORE SESSION
   * No realiza auto-login (por tu requerimiento de no persistir token).
   */
  const restoreSession = async () => {
    try {
      // No intentamos restaurar sesión automáticamente porque no guardas token.
      return;
    } catch (err) {
      console.error("Restore session error:", err);
    }
  };

  useEffect(() => {
    // No llamamos a restoreSession para evitar auto-login.
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        loading,
        login,
        logout,
        API: API_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
