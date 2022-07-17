import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { useAuthContext } from "../contexts/auth";
import { loginAPI } from "../api/auth";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen() {
  const { setIsAuth } = useAuthContext();

  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [borderColor, setBorderColor] = useState({ email: "#E5E7EB", password: "#E5E7EB" });

  const onFocus = (name) => {
    setBorderColor((state) => ({ ...state, [name]: "#014AC1" }));
  };

  const onBlur = (name) => {
    setBorderColor((state) => ({ ...state, [name]: "#E5E7EB" }));
  };

  const onPress = async () => {
    const response = await loginAPI({ email, password });

    if (!response.success) {
      alert(response.error.message);
    }

    if (response.success) {
      const { auth, token } = response.data;

      await SecureStore.setItemAsync("token", token);
      setIsAuth(auth);
    }
  };

  const emailInputStyle = { borderWidth: 2, borderColor: borderColor.email, padding: 12, borderRadius: 4 };
  const passwordInputStyle = { borderWidth: 2, borderColor: borderColor.password, padding: 12, borderRadius: 4 };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Inicio de sesión</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Bienvenido</Text>
        <Text style={styles.formSmallText}>Ingresa las credenciales otorgadas por la compañia</Text>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Email:</Text>
          <TextInput
            style={emailInputStyle}
            placeholder="Ingresar tu email..."
            onFocus={() => onFocus("email")}
            onBlur={() => onBlur("email")}
            value={email}
            onChangeText={onChangeEmail}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Contraseña:</Text>
          <TextInput
            style={passwordInputStyle}
            placeholder="Ingresa tu contraseña..."
            secureTextEntry={true}
            onFocus={() => onFocus("password")}
            onBlur={() => onBlur("password")}
            value={password}
            onChangeText={onChangePassword}
          />
        </View>

        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Continuar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#014AC1",
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
  form: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  formTitle: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#014AC1",
  },
  formSmallText: {
    marginTop: 10,
    marginBottom: 16,
    lineHeight: 20,
    color: "#6B7280",
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    marginBottom: 8,
    fontSize: 16,
    color: "#6B7280",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#014AC1",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
});
