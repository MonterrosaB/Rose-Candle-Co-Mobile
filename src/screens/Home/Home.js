import React, { useContext } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import CardWidget from "./components/CardWidget";
import LowStockList from "./components/LowStockList";
import PopularProducts from "./components/PopularProducts";
import { AuthContext } from "../../context/AuthContext";
import useHome from "./hooks/useHome";

const Home = ({ navigation }) => {
  const { user } = useContext(AuthContext); // obtenemos info del usuario
  const {
    customerCount,
    latestCustomerCount,
    totalOrders,
    currentMonthOrders,
    totalEarnings,
    monthlyEarnings,
    lowStockMaterials,
    bestSellingProducts,
  } = useHome(); // hook para traer datos de home

  // Mostrar loader mientras los datos llegan
  if (
    customerCount === null ||
    totalOrders === null ||
    totalEarnings === null
  ) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#C2A878" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ paddingHorizontal: 20 }}
      contentContainerStyle={{ paddingTop: 50, paddingBottom: 20 }}
    >
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 20 }}>
        Hola de nuevo, {user?.name || "Invitado"}
      </Text>

      {/* Tarjetas con resumen de métricas */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <CardWidget
          bgColor="#F7F5EE"
          textColor="#333"
          title="Pedidos Totales"
          value={totalOrders}
          increment={currentMonthOrders}
        />
        <CardWidget
          bgColor="#C2A878"
          textColor="#fff"
          title="Ingresos Totales"
          value={`$${totalEarnings}`}
          increment={`$${monthlyEarnings}`}
        />
        <CardWidget
          bgColor="#F7F5EE"
          textColor="#333"
          title="Usuarios Totales"
          value={customerCount}
          increment={latestCustomerCount}
        />
      </View>

      {/* Lista de materiales con bajo stock */}
      <LowStockList materials={lowStockMaterials} />

      {/* Productos más vendidos */}
      <PopularProducts data={bestSellingProducts} />
    </ScrollView>
  );
};

export default Home;
