import { View, FlatList, Text, StyleSheet, Pressable, RefreshControl } from "react-native";
import { useState, useCallback } from "react"
import { useAuthContext } from "../contexts/auth"
import { useShipmentContext } from "../contexts/shipment"
import { confirmShipmentAPI, cancelShipmentAPI } from "../api/shipments"
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { MaterialCommunityIcons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";

export default function ShipmentScreen({ navigation  }) {
  const { setIsAuth } = useAuthContext()
  const { shipments, setShipments, getShipments } = useShipmentContext()
  const [refreshing, setRefreshing] = useState(false);

  const notify = (type, title, message) => {
    return (Dialog.show({ type, title, textBody: message, button: 'Ok', }))
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getShipments()
    setRefreshing(false)
  }, []);

  const data = shipments?.all?.map((shipment) => {
    const { idShipment, shipmentDescription: { address, origin, destination }, shipmentStatusName, idShipmentStatus, shipmentCreatedAt } = shipment
    let icon = null
    const iconSize = 36

    if (idShipmentStatus === 1) {
      icon = <AntDesign name="checkcircle" size={iconSize} color="#22c55b" />
    }

    if (idShipmentStatus === 2) {
      icon = <MaterialCommunityIcons name="truck-fast" size={iconSize} color="#014AC1" />
    }

    if (idShipmentStatus === 3) {
      icon = <MaterialIcons name="cancel" size={iconSize} color="#ef4444" />
    }

    return { key: idShipment, shipmentId: idShipment, address, origin, destination, idShipmentStatus, shipmentStatusName, shipmentCreatedAt, icon }
  }).reverse()

  const onPress = async () => {
    if (!shipments?.active?.idShipment) {
      return
    }

    const response = await confirmShipmentAPI({ shipmentId: shipments.active.idShipment })

    if (response?.response?.status >= 401) {
      await SecureStore.deleteItemAsync("token")
      return setIsAuth(false)
    }

    if (response.success) {
      setRefreshing(true)
      getShipments()
      setRefreshing(false)

      return notify(ALERT_TYPE.SUCCESS, "Envío confirmado", response.data.message)
    }
  }

  const cancel = async (shipmentId) => {
    const response = await cancelShipmentAPI({ shipmentId })

    if (response?.response?.status >= 401) {
      await SecureStore.deleteItemAsync("token")
      return setIsAuth(false)
    }

    if (response.success) {
      setRefreshing(true)
      getShipments()
      setRefreshing(false)

      return notify(ALERT_TYPE.DANGER, "Envío cancelado", response.data.message)
    }
  }

  const buttonBackground = { backgroundColor: shipments.active ? "#014AC1" : "#e8e8e8" }
 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Envíos</Text>
      </View>

      <FlatList refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={{ flex: 1 }} contentContainerStyle={styles.shipmentsContainer} data={data} renderItem={({ item }) => (
        <View style={[styles.card, styles.shadowProp]}>
          <View style={{ width: 80, justifyContent: "center", alignItems: "center" }}>
            {item.icon}
          </View>
          <View style={{ padding: 16, backgroundColor: "#014AC1", flex: 1, borderTopRightRadius: 12, borderBottomRightRadius: 12,   }}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Dirección: <Text style={{ fontWeight: "400", fontSize: 12 }}>{item.address}</Text></Text>
            <Text style={{ color: "#fff", fontWeight: "700", marginTop: 4, }}>Fecha: <Text style={{ fontWeight: "400", fontSize: 12 }}>       {item.shipmentCreatedAt}</Text></Text>
            <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
              {item.idShipmentStatus === 2 ? (
                <Pressable style={{ height: 30, paddingHorizontal: 16, justifyContent: "center", alignItems: "flex-end", borderRadius: 24, backgroundColor: "#ef4444" }} onPress={() => cancel(item.shipmentId)}>
                  <Text style={{ color: "#fff", fontWeight: "700" }}>Cancelar</Text>
                </Pressable>
              ) : <View />}
             
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 20 }}>{item.shipmentStatusName}</Text>
            </View>
          </View>
        </View>
      )} />

      <View style={styles.buttonContainer}>
        <Pressable style={[styles.completedButton, buttonBackground]} onPress={onPress} disabled={shipments.active ? false : true}>
          <Text style={styles.completedButtonText}>Confirmar envío</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#014AC1"
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  shipmentsContainer: {
    // flex: 1,
    padding: 16, 
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    minHeight: 75, 
    borderRadius: 12,
    marginBottom: 16
  },
  shadowProp: {
    shadowColor: '#ADADAD',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  elevation: {
    elevation: 20,
    shadowColor: '#52006A',
  },
  buttonContainer: {
    padding: 16,
    // borderTopWidth: 1,
    // borderTopColor: "#E5E7EB",
    // borderBottomColor: "none"
  },
  completedButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 24,
    elevation: 3,
    // backgroundColor: "#014AC1",
  }, 
  completedButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});

