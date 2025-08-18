import React from "react";
import { View, Text, Dimensions, ActivityIndicator } from "react-native";
import { PieChart } from "react-native-chart-kit";

// Colores para las porciones del gráfico
const COLORS = ["#E8DCC3", "#C2A878", "#A3A380", "#A380A3", "#C278C2"];
// Ancho de la pantalla para ajustar el tamaño del gráfico
const screenWidth = Dimensions.get("window").width;

const PopularProducts = ({ data = [] }) => {
  // Debug: imprimir los datos recibidos
  console.log("📊 PopularProducts data:", data);

  // Si no hay datos, mostrar indicador de carga
  if (!data || data.length === 0) {
    return (
      <View
        style={{
          padding: 20,
          borderRadius: 20,
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          Productos Populares
        </Text>
        {/* Spinner de carga */}
        <ActivityIndicator size="large" color="#C2A878" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Cargando productos...
        </Text>
      </View>
    );
  }

  // Transformar los datos para el PieChart
  const pieData = data.map((item, index) => ({
    // Nombre del producto, o "Item X" si no existe
    name: item.productName?.length > 0 ? item.productName : `Item ${index + 1}`,
    // Cantidad de ventas
    population: Number(item.totalQuantity) || 0,
    // Color asignado por índice
    color: COLORS[index % COLORS.length],
    legendFontColor: "#333",
    legendFontSize: 12,
  }));

  return (
    <View
      style={{
        padding: 20,
        borderRadius: 20,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: 20,
      }}
    >
      {/* Título */}
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
        Productos Populares
      </Text>

      {/* Gráfico circular */}
      <PieChart
        data={pieData} // Datos transformados
        width={screenWidth - 60} // Ancho dinámico según pantalla
        height={220} // Altura fija
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Color de texto y leyenda
        }}
        accessor={"population"} // Propiedad que define el tamaño de la porción
        backgroundColor={"transparent"} // Fondo transparente
        paddingLeft={"10"} // Margen izquierdo
        center={[0, 0]} // Centro del gráfico
        absolute // Mostrar valores absolutos en el gráfico
      />
    </View>
  );
};

export default PopularProducts;
