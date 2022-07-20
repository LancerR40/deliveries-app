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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Perfil</Text>
      </View>

      <View style={styles.profileContainer}>
        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
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
  profileContainer: {
    padding: 16
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 24,
    elevation: 3,
    backgroundColor: "#014AC1",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  }
});
