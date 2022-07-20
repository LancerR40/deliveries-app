import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { useAuthContext } from "../contexts/auth";
import { loginAPI } from "../api/auth";
import * as SecureStore from "expo-secure-store";
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

export default function LoginScreen() {
  const { setIsAuth } = useAuthContext();

  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [borderColor, setBorderColor] = useState({ email: "#E5E7EB", password: "#E5E7EB" });

  const notify = (type, title, message) => {
    return (Dialog.show({ type, title, textBody: message, button: 'close', }))
  }

  const onFocus = (name) => {
    setBorderColor((state) => ({ ...state, [name]: "#014AC1" }));
  };

  const onBlur = (name) => {
    setBorderColor((state) => ({ ...state, [name]: "#E5E7EB" }));
  };

  const onPress = async () => {
    if (!email) {
      return notify(ALERT_TYPE.WARNING, "Correo requerido", "Debes agregar un correo para continuar.")
    }

    if (!password) {
      return notify(ALERT_TYPE.WARNING, "Contraseña requerida", "Debes agregar una contraseña para continuar.")
    }

    const response = await loginAPI({ email, password });
    const statusCode = response?.response?.status

    if (statusCode >= 401) {
      await SecureStore.deleteItemAsync("token")
      return setIsAuth(false)
    }

    if (!response.success) {
      notify(ALERT_TYPE.DANGER, "Credenciales incorrectas")
    }

    if (response.success) {
      const { auth, token } = response.data;

      await SecureStore.setItemAsync("token", token);
      setIsAuth(auth);
    }
  };

  const emailInputStyle = { borderWidth: 2, borderColor: borderColor.email, height: 48, paddingHorizontal: 16, borderRadius: 4 };
  const passwordInputStyle = { borderWidth: 2, borderColor: borderColor.password, height: 48, paddingHorizontal: 16, borderRadius: 4 };

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
    fontSize: 32,
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
    height: 48,
    borderRadius: 24,
    elevation: 3,
    backgroundColor: "#014AC1",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
});
