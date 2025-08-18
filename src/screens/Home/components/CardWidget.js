import React from "react";
import { View, Text, Animated } from "react-native";

const CardWidget = ({ bgColor, textColor, title, value, increment }) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <View style={{
      backgroundColor: bgColor,
      padding: 20,
      borderRadius: 20,
      marginBottom: 10,
      minWidth: 110,
      maxWidth: 160,
      flex: 1
    }}>
      <Text style={{ fontSize: 16, fontWeight: "600", color: textColor }}>{title}</Text>
      <Animated.Text style={{ fontSize: 24, fontWeight: "700", color: textColor, marginTop: 10 }}>
        {value}
      </Animated.Text>
      <Text style={{ fontSize: 14, color: textColor }}>+{increment}</Text>
    </View>
  );
};

export default CardWidget;
