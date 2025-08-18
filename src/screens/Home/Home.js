import React from "react";
import { View, Text, ScrollView } from "react-native";
import CardWidget from "./components/CardWidget";
import LowStockList from "./components/LowStockList";
import PopularProducts from "./components/PopularProducts";

// Datos de ejemplo
const sampleUser = { name: "Usuario" };
const sampleOrders = 120;
const sampleCurrentMonthOrders = 15;
const sampleEarnings = 4500;
const sampleMonthlyEarnings = 800;
const sampleCustomerCount = 75;
const sampleLatestCustomerCount = 5;
const sampleLowStockMaterials = [
  { _id: "1", materialName: "Cera", stock: 3 },
  { _id: "2", materialName: "Mechas", stock: 5 },
];
const sampleBestSellingProducts = [
  { _id: "1", productName: "Vela Aromática", totalQuantity: 20 },
  { _id: "2", productName: "Vela de Soja", totalQuantity: 15 },
];

const Home = () => {
  return (
    <ScrollView
      style={{ paddingHorizontal: 20 }}
      contentContainerStyle={{ paddingTop: 50, paddingBottom: 20 }} // Aquí agregamos espacio arriba y abajo
    >
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 20 }}>
        Hola de nuevo, {sampleUser.name}
      </Text>

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
          value={sampleOrders}
          increment={sampleCurrentMonthOrders}
        />
        <CardWidget
          bgColor="#C2A878"
          textColor="#fff"
          title="Ingresos Totales"
          value={`$${sampleEarnings}`}
          increment={`$${sampleMonthlyEarnings}`}
        />
        <CardWidget
          bgColor="#F7F5EE"
          textColor="#333"
          title="Usuarios Totales"
          value={sampleCustomerCount}
          increment={sampleLatestCustomerCount}
        />
      </View>

      <LowStockList materials={sampleLowStockMaterials} />
      <PopularProducts data={sampleBestSellingProducts} />
    </ScrollView>
  );
};

export default Home;
