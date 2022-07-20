import { StyleSheet, ScrollView, View, Text, Pressable, TextInput, Image, RefreshControl } from "react-native";
import { useState, useEffect, useCallback } from "react"
import { useAuthContext } from "../contexts/auth";
import * as SecureStore from "expo-secure-store";
import { getUserDataAPI } from "../api/user"
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

export default function ProfileScreen() {
  const { setIsAuth } = useAuthContext();
  const [userData, setUserData] = useState(null)
  const [refreshing, setRefreshing] = useState(false);

  const notify = (type, title, message) => {
    return (Dialog.show({ type, title, textBody: message, button: 'Ok', }))
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getUserData()
    setRefreshing(false)
  }, []);

  useEffect(() => {
    setRefreshing(true);
    getUserData()
    setRefreshing(false);
  }, [])

  const getUserData = async () => {
    const response = await getUserDataAPI()

    if (response?.response?.status >= 401) {
      await SecureStore.deleteItemAsync("token")
      return setIsAuth(false)
    }

    if (!response.success) {
      return notify(ALERT_TYPE.WARNING, "Ups, ocurrió un error", "Por favor, intenta más tarde.")
    }

    if (response.success) {
      const { driverName, driverLastname, driverIdentificationCode, driverPhoto, driverDateOfBirth, driverEmail } = response.data
      setUserData({
        name: driverName,
        lastname: driverLastname,
        identificationCode: driverIdentificationCode,
        photo: driverPhoto,
        dateOfBirth: driverDateOfBirth,
        email: driverEmail
      })
    }
  }

  const onPress = async () => {
    await SecureStore.deleteItemAsync("token");
    setIsAuth(false);
  };

  console.log(userData)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Perfil</Text>
      </View>

      {userData && (
        <ScrollView style={styles.profileContainer} contentContainerStyle={{ padding: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={styles.photoContainer}>
            <Image style={styles.photo} source={{ uri: userData.photo }} />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Nombre completo:</Text>
            <TextInput style={styles.formInput} editable={false} defaultValue={`${userData.name} ${userData.lastname}`} />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Cédula:</Text>
            <TextInput style={styles.formInput} editable={false} defaultValue={userData.identificationCode} />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Fecha de nacimiento:</Text>
            <TextInput style={styles.formInput} editable={false} defaultValue={String(userData.dateOfBirth)} />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Correo:</Text>
            <TextInput style={styles.formInput} editable={false} defaultValue={userData.email} />
          </View>

          <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Cerrar sesión</Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
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
    flex: 1
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 16
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50 
  },  
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    marginBottom: 8,
    fontSize: 16,
    color: "#6B7280",
  },
  formInput: {
    backgroundColor: "#F2F2F2",
    // borderWidth: 2, 
    // borderColor: "#E5E7EB", 
    height: 48, 
    paddingHorizontal: 16, 
    borderRadius: 4,
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
