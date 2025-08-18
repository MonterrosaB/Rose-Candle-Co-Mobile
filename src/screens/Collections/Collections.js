import React from "react";
import { View } from "react-native";
import { useCollections } from "./hooks/useCollections";
import { CollectionsUI } from "./components/CollectionsUI";

export default function Collections() {
  const collectionsProps = useCollections();

  return (
    <View style={{ flex: 1 }}>
      <CollectionsUI {...collectionsProps} />
    </View>
  );
}
