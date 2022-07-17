import { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, View, Dimensions } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

export default function TrackingScreen() {
  const [locationPermission, setLocationPermission] = useState(false);

  const [position, setPosition] = useState(null);
  const [destination, setDestionation] = useState({ latitude: 10.909745, longitude: -71.749526 });

  useEffect(() => {
    getLocationPermission();
  }, []);

  useEffect(() => {
    if (locationPermission) {
      getLocation();
    }
  }, [locationPermission]);

  const getLocation = async () => {
    const { coords } = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords;

    setPosition({ latitude, longitude, latitudeDelta: 0.09, longitudeDelta: 0.04 });
  };

  const getLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return alert("Debes aceptar los permisos de localización.");
    }

    setLocationPermission(!locationPermission);
  };

  if (!position) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={position}
          showsUserLocation
          userLocationAnnotationTitle="Hello"
        >
          <Marker coordinate={{ latitude: 10.614843, longitude: -71.634769 }} title="Fabrica"></Marker>
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
});
