// src/Login/hooks/useUserAuth.js
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../context/AuthContext";

export default function useUserAuth(config = {}) {
  const API_BASE = config.API_BASE || "https://rose-candle-co.onrender.com";
  const API_LOGIN = config.API_LOGIN || `${API_BASE}/api/auth/login`;
  const API_PROFILE = config.API_PROFILE || `${API_BASE}/api/auth/me`;

  const navigation = useNavigation();
  const auth = useAuth?.() || {};

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [errors, setErrors] = useState({ username: "", password: "", general: "" });

  const abortRef = useRef(null);
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const clearErrors = () => setErrors({ username: "", password: "", general: "" });

  const validate = () => {
    const next = { username: "", password: "", general: "" };
    if (!username?.trim()) next.username = "Campo requerido";
    if (!password) next.password = "Campo requerido";
    if (password && password.length < 4) next.password = "Contraseña muy corta";
    setErrors(next);
    return !next.username && !next.password;
  };

  const setAuthContext = async ({ token, user }) => {
    console.log("setAuthContext -> token:", token, "user:", user);
    if (auth && typeof auth.setToken === "function") auth.setToken(token || null);
    if (auth && typeof auth.setUser === "function") auth.setUser(user || null);
  };

  const persistSession = async ({ token, user }) => {
    try {
      if (token) await AsyncStorage.setItem("token", token);
      if (user) await AsyncStorage.setItem("user", JSON.stringify(user));
      console.log("Session persisted:", { token, user });
    } catch (e) {
      console.warn("No se pudo persistir la sesión:", e);
    }
  };

  const clearSession = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user"]);
      console.log("Session cleared");
    } catch {}
  };

  const getStoredToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Stored token:", token);
      return token || null;
    } catch {
      return null;
    }
  };

  const handleLogin = async () => {
    clearErrors();
    if (!validate()) return { ok: false, message: "Corrige los campos marcados" };

    console.log("Attempting login with:", { username, password });
    setLoading(true);
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: username.trim(), password }),
        signal: abortRef.current.signal,
      });

      console.log("Login response status:", res.status);
      const data = await safeJson(res);
      console.log("Login response data:", data);

      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || "Credenciales inválidas";
        console.log("Login error message:", msg);
        const fieldErr = { username: "", password: "", general: "" };

        if (/user/i.test(msg) && /required|empty|missing/i.test(msg)) {
          fieldErr.username = "Campo requerido";
        } else if (/password/i.test(msg) && /required|empty|missing/i.test(msg)) {
          fieldErr.password = "Campo requerido";
        } else if (/invalid|wrong|incorrect/i.test(msg)) {
          fieldErr.general = "Usuario o contraseña incorrectos";
        } else if (/disabled|inactive/i.test(msg)) {
          fieldErr.general = "Cuenta deshabilitada";
        } else if (/too short/i.test(msg)) {
          if (password.length < 8) fieldErr.password = "Contraseña muy corta";
        } else {
          fieldErr.general = msg;
        }

        setErrors(fieldErr);
        setLoading(false);
        return { ok: false, message: fieldErr.general || "Error en el inicio de sesión" };
      }

      const token = data?.token || data?.data?.token || "";
      const user = data?.user || data?.data?.user || null;

      console.log("Login success -> token:", token, "user:", user);

      await persistSession({ token, user });
      await setAuthContext({ token, user });

      navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });

      setLoading(false);
      return { ok: true, user, token };
    } catch (err) {
      console.error("Login error catch:", err);
      if (err?.name === "AbortError") {
        setLoading(false);
        return { ok: false, message: "Solicitud cancelada" };
      }
      setErrors((e) => ({ ...e, general: "Error de conexión. Intenta de nuevo." }));
      setLoading(false);
      return { ok: false, message: "Error de conexión. Intenta de nuevo." };
    }
  };

  const restoreSession = async () => {
    setRestoring(true);
    const token = await getStoredToken();
    if (!token) {
      setRestoring(false);
      return { ok: false };
    }

    try {
      const res = await fetch(API_PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await safeJson(res);
      console.log("Restore session response:", data);

      if (res.ok) {
        const user = data?.user || data?.data || data;
        await setAuthContext({ token, user });
        navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
        setRestoring(false);
        return { ok: true, user, token };
      }

      await clearSession();
      setRestoring(false);
      return { ok: false };
    } catch (err) {
      console.error("Restore session error:", err);
      setRestoring(false);
      return { ok: false };
    }
  };

  const logout = async () => {
    await clearSession();
    await setAuthContext({ token: null, user: null });
    navigation.reset({ index: 0, routes: [{ name: "LoginStack" }] });
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const canSubmit = useMemo(
    () => !loading && username.trim().length > 0 && password.length > 0,
    [loading, username, password]
  );

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    restoring,
    errors,
    canSubmit,
    handleLogin,
    restoreSession,
    logout,
    clearErrors,
    API_LOGIN,
    API_PROFILE,
  };
}

async function safeJson(res) {
  try {
    const txt = await res.text();
    return txt ? JSON.parse(txt) : {};
  } catch (err) {
    console.error("safeJson error:", err);
    return {};
  }
}
