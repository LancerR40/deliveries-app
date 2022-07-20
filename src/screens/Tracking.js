import { useState, useEffect, useCallback } from "react";
import { StyleSheet, RefreshControl, View, ScrollView, Dimensions, Text, Pressable  } from "react-native"
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import { useShipmentContext } from "../contexts/shipment"
import { shipmentTrackingAPI } from "../api/shipments"

export default function TrackingScreen() {
  const { shipments, setShipments, getShipments } = useShipmentContext()
  const [refreshing, setRefreshing] = useState(false);

  const [permissions, setPermissions] = useState({ foregroundPermission: false })
  const [currentPosition, setCurrentPosition] = useState(null);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getShipments()
    setRefreshing(false)
  }, []);

  useEffect(() => {
    getForegroundPermission();
  }, [])
  
  useEffect(() => {
    getInitialPosition()
  }, [permissions.foregroundPermission])

  useEffect(() => {
    let interval = null

    if (!shipments.active && interval) {
      return clearInterval(interval)
    }

    if (shipments.active) {
      interval = setInterval(async () => {
        const { latitude, longitude } = await getCurrentPosition()
        const data = { shipmentId: shipments.active.idShipment, driverPosition: { latitude, longitude }, shipmentDestination: { latitude: Number(shipments.active.shipmentDescription.destination.latitude), longitude: Number(shipments.active.shipmentDescription.destination.longitude )} }
        
        const response = await shipmentTrackingAPI(data);

        if (response?.response?.status >= 401) {
          await SecureStore.deleteItemAsync("token")
          return setIsAuth(false)
        }
      }, 10000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [shipments.active])

  const getForegroundPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return alert("Debes aceptar los permisos de localización para continuar.");
    }

    setPermissions((state) => ({ ...state, foregroundPermission: true }))
  }

  const getInitialPosition = async () => {
    const { latitude, longitude } = await getCurrentPosition()
    setCurrentPosition({ latitude, longitude, latitudeDelta: 0.09, longitudeDelta: 0.04 })
  }

  const getCurrentPosition = async () => {
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
    return { latitude, longitude }
  }

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* If not allow permission */}
      {!permissions.foregroundPermission && (
        <View style={styles.notMapRenderedContainer}>
          <Text style={{ color: "gray", textAlign: "center", maxWidth: 280, marginBottom: 16 }}>Necesitas otorgar permisos de ubicación para continuar.</Text>
          <Pressable style={styles.foregroundPermissionButton} onPress={getForegroundPermission}>
            <Text style={styles.foregroundPermissionButtonText}>Otorgar permisos</Text>
          </Pressable>
        </View>
      )}

       {/* If permission is allowed */}
      {permissions.foregroundPermission && currentPosition && (
        <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={currentPosition} showsUserLocation>
          {shipments.active && (
            <>
              <Marker title={shipments.active.shipmentDescription.address} coordinate={{ latitude: Number(shipments.active.shipmentDescription.destination.latitude), longitude: Number(shipments.active.shipmentDescription.destination.longitude) }} />
              <Polyline coordinates={[{ latitude: Number(currentPosition.latitude), longitude: Number(currentPosition.longitude)}, { latitude: Number(shipments.active.shipmentDescription.destination.latitude), longitude: Number(shipments.active.shipmentDescription.destination.longitude) } ]} strokeColor="#3b82f6" strokeWidth={3} />
            </>
          )}
        </MapView>
      )}
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  notMapRenderedContainer: {
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center"
  },
  foregroundPermissionButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 48,
    borderRadius: 24,
    elevation: 3,
    backgroundColor: "#014AC1",
  },
  foregroundPermissionButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
});