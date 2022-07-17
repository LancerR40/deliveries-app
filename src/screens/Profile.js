import { StyleSheet, SafeAreaView, View, Text, Pressable } from "react-native";
import { useAuthContext } from "../contexts/auth";
import * as SecureStore from "expo-secure-store";

export default function ProfileScreen() {
  const { setIsAuth } = useAuthContext();

  const onPress = async () => {
    await SecureStore.deleteItemAsync("token");
    setIsAuth(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mi Perfil</Text>
      </View>

      <View style={styles.container}>
        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Salir</Text>
        </Pressable>
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
  container: {
    padding: 16,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "red",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
});
