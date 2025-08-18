// src/screens/Record/hooks/useRecord.js
import { useState, useEffect } from "react";
import toast from "react-native-toast-message";

/**
 * useRecord
 * Hook responsable de traer y normalizar los datos requeridos por RecordUI.
 * - Adapta las rutas al backend real que ya tienes montado en app.js
 * - Maneja respuestas no-JSON sin romper la app
 * - Agrega agregación mensual para ventas (salesOrder)
 */

const API_BASE = "https://rose-candle-co.onrender.com/api";

/** Helpers */
const tryParseJSON = (maybe) => {
  if (maybe == null) return null;
  if (typeof maybe !== "string") return maybe;
  try {
    return JSON.parse(maybe);
  } catch {
    // no es JSON -> devolver la string cruda
    return maybe;
  }
};

const fetchSafe = async (url) => {
  try {
    const res = await fetch(url);
    const text = await res.text(); // siempre leer como texto primero
    if (!res.ok) {
      console.warn(`[useRecord] ${url} -> HTTP ${res.status} : returning null`);
      console.warn(text.slice(0, 300));
      return null;
    }
    // Intentar parsear JSON; si no se puede, devolver texto (y lo normalizaremos)
    const parsed = tryParseJSON(text);
    return parsed;
  } catch (err) {
    console.error(`[useRecord] fetch error ${url}`, err);
    return null;
  }
};

/** Convierte orders -> datos mensuales [{ month: 'Aug 2025', total: 123 }] */
const aggregateSalesMonthly = (orders) => {
  if (!Array.isArray(orders)) return [];
  const months = [
    "Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"
  ];
  const map = {}; // key: YYYY-MM -> total

  for (const o of orders) {
    // Determinar fecha del pedido
    const dateStr = o.createdAt || o.date || o.created_at || o.timestamp;
    let d;
    if (dateStr) {
      d = new Date(dateStr);
      if (isNaN(d)) d = null;
    }
    // Si no hay fecha, saltar (o agrupar en "Unknown")
    if (!d) continue;

    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const key = `${y}-${String(m).padStart(2, "0")}`;

    // Obtener total del pedido: intentar campos comunes, si no calcular desde items
    let orderTotal = 0;
    if (typeof o.total === "number") orderTotal = o.total;
    else if (typeof o.totalAmount === "number") orderTotal = o.totalAmount;
    else if (typeof o.total_price === "number") orderTotal = o.total_price;
    else if (Array.isArray(o.items)) {
      orderTotal = o.items.reduce((acc, it) => {
        const qty = Number(it.quantity ?? it.qty ?? 1);
        const price = Number(it.price ?? it.unitPrice ?? it.unit_price ?? 0);
        return acc + qty * price;
      }, 0);
    } else {
      // si no hay forma de calcular, intentar campos sueltos
      orderTotal = Number(o.amount ?? 0);
    }

    map[key] = (map[key] || 0) + (isNaN(orderTotal) ? 0 : orderTotal);
  }

  // Convertir a array ordenado cronológicamente
  const entries = Object.entries(map)
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .map(([key, total]) => {
      const [y, mm] = key.split("-");
      const monthName = months[Number(mm) - 1] ?? `${mm}`;
      return { month: `${monthName} ${y}`, total };
    });

  return entries;
};

/** Normaliza stock a partir de rawMaterials o products */
const normalizeStock = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    // distintas propiedades que por lo general pueden existir
    const name = r.name || r.producto || r.title || r.material || r.label || "Sin nombre";
    const stock = Number(r.stock ?? r.quantity ?? r.qty ?? r.currentStock ?? 0);
    const minimo = Number(r.minimo ?? r.min ?? r.minimum ?? 0);
    const unit = r.unit || r.unidad || r.u || r.unitMeasure || "";
    return { name, stock, minimo, unit };
  });
};

/** Normaliza 'costs' obtenidos de productionCostHistory o materialBalance */
const normalizeCosts = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    // Intentar varios campos según estructura del backend
    const materia = r.material || r.materia || r.name || r.rawMaterial || "Sin materia";
    const unidad = r.unit || r.unidad || r.u || "u";
    const cantidad = Number(r.quantity ?? r.cantidad ?? r.amount ?? 0);
    const costoUnitario = Number(r.unitCost ?? r.costoUnitario ?? r.cost ?? 0);
    const costoTotal = Number(r.totalCost ?? r.costoTotal ?? costoUnitario * cantidad);
    return {
      producto: r.productName || r.producto || materia,
      materia,
      unidad,
      cantidad,
      costoUnitario,
      costoTotal,
    };
  });
};

export default function useRecord() {
  const [loading, setLoading] = useState(true);
  const [bestSellers, setBestSellers] = useState([]);
  const [worstSellers, setWorstSellers] = useState([]);
  const [stockMinData, setStockMinData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const tableColumns = {
    Producto: "producto",
    "Materia Prima": "materia",
    Unidad: "unidad",
    "Cantidad Utilizada": "cantidad",
    "Costo Unitario": "costoUnitario",
    "Costo Total": "costoTotal",
  };

  const productTableColumns = {
    Producto: "name",
    Unidades: "totalQuantity",
    "Ingresos Generados": "totalRevenue",
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1) Traer best/worst (estas rutas ya existen en /api/products)
      const bestRaw = await fetchSafe(`${API_BASE}/products/bestSellers`);
      const worstRaw = await fetchSafe(`${API_BASE}/products/worstSellers`);

      // Normalizar si la API devolvió una string que contiene JSON
      const bestParsed = tryParseJSON(bestRaw) ?? [];
      const worstParsed = tryParseJSON(worstRaw) ?? [];

      // Asegurarse que sean arrays
      const bestArr = Array.isArray(bestParsed) ? bestParsed : [];
      const worstArr = Array.isArray(worstParsed) ? worstParsed : [];

      // 2) COSTOS: intentar productionCostHistory -> materialBalance -> rawMaterials
      let costsRaw =
        (await fetchSafe(`${API_BASE}/productionCostHistory`)) ??
        (await fetchSafe(`${API_BASE}/materialBalance`)) ??
        (await fetchSafe(`${API_BASE}/rawMaterials`)) ??
        null;

      // Si alguno devolvió un string JSON, parsearlo
      costsRaw = tryParseJSON(costsRaw);
      const costsNormalized = normalizeCosts(costsRaw ?? []);

      // 3) VENTAS: traer salesOrder y agregar por mes
      const salesRaw = tryParseJSON(await fetchSafe(`${API_BASE}/salesOrder`)) ?? [];
      // salesRaw puede venir directamente como array de orders o como un objeto { data: [...] }
      const orders = Array.isArray(salesRaw) ? salesRaw : (Array.isArray(salesRaw?.data) ? salesRaw.data : []);
      const salesMonthly = aggregateSalesMonthly(orders);

      // 4) STOCK: intentar rawMaterials -> products
      let stockRaw = tryParseJSON(await fetchSafe(`${API_BASE}/rawMaterials`));
      if (!Array.isArray(stockRaw) || stockRaw.length === 0) {
        stockRaw = tryParseJSON(await fetchSafe(`${API_BASE}/products`));
        // en products puede que el stock esté en campos diferentes
      }
      const stockNormalized = normalizeStock(stockRaw ?? []);

      // Guardar estados
      setBestSellers(bestArr);
      setWorstSellers(worstArr);
      setTableData(costsNormalized);
      setChartData(salesMonthly);
      setStockMinData(stockNormalized);
    } catch (error) {
      console.error("Error fetching data (useRecord)", error);
      toast.show({ type: "error", text1: "Error al obtener datos (ver consola)" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // opcional: agregar intervalo de refresh si quieres, por ahora no
  }, []);

  return {
    bestSellers,
    worstSellers,
    stockMinData,
    tableData,
    tableColumns,
    productTableColumns,
    chartData,
    loading,
  };
}
