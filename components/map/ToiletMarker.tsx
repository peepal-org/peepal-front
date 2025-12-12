import { Toilet } from "@/types/ui/Toilet";
import { Text, View } from "react-native";
import { Marker } from "react-native-maps";

type ToiletMarkerProps = {
  toilet: Toilet;
  theme: any;
  onPress: () => void;
};

export function ToiletMarker({ toilet, theme, onPress }: ToiletMarkerProps) {
  return (
    <Marker
      coordinate={{
        latitude: toilet.latitude,
        longitude: toilet.longitude,
      }}
      onPress={onPress}
    >
      <View
        style={{
          backgroundColor: toilet.free ? theme.primary : theme.accent,
          padding: 6,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#fff",
        }}
      >
        <Text style={{ fontSize: 16 }}>🚻</Text>
      </View>
    </Marker>
  );
}
