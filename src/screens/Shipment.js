import { View, FlatList, Text, StyleSheet, Pressable } from "react-native";
import { useShipmentContext } from "../contexts/shipment"
import { MaterialCommunityIcons, AntDesign, MaterialIcons } from '@expo/vector-icons';

export default function ShipmentScreen({ navigation  }) {
  const { shipments, setShipments } = useShipmentContext()
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

    return { key: idShipment, address, origin, destination, idShipmentStatus, shipmentStatusName, shipmentCreatedAt, icon }
  }).reverse()

  const buttonBackground = { backgroundColor: shipments.active ? "#014AC1" : "#e8e8e8" }
 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Envíos</Text>
      </View>

      <FlatList contentContainerStyle={styles.shipmentsContainer} data={data} renderItem={({ item }) => (
        <View style={[styles.card, styles.shadowProp]}>
          <View style={{ width: 80, justifyContent: "center", alignItems: "center" }}>
            {item.icon}
          </View>
          <View style={{ padding: 16, backgroundColor: "#014AC1", flex: 1, borderTopRightRadius: 12, borderBottomRightRadius: 12,   }}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Dirección: <Text style={{ fontWeight: "400", fontSize: 12 }}>{item.address}</Text></Text>
            <Text style={{ color: "#fff", fontWeight: "700", marginTop: 4, }}>Fecha: <Text style={{ fontWeight: "400", fontSize: 12 }}>       {item.shipmentCreatedAt}</Text></Text>
            <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
              {item.idShipmentStatus === 2 ? (
                <Pressable style={{ height: 30, paddingHorizontal: 16, justifyContent: "center", alignItems: "flex-end", borderRadius: 24, backgroundColor: "#ef4444" }}>
                  <Text style={{ color: "#fff", fontWeight: "700" }}>Cancelar</Text>
                </Pressable>
              ) : <View />}
             
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 20 }}>{item.shipmentStatusName}</Text>
            </View>
          </View>
        </View>
      )} />

      <View style={styles.buttonContainer}>
        <Pressable style={[styles.completedButton, buttonBackground]}>
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
    flex: 1,
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

