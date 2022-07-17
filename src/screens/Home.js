import { StyleSheet, Text, View, SafeAreaView } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pedidos</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    width: "100%",
    height: "25%",
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#014AC1",
  },
  headerText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#fff",
  },
});
