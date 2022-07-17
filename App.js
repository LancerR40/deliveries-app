import { StatusBar } from "expo-status-bar";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import { AuthContextProvider, useAuthContext } from "./src/contexts/auth";

import LoginScreen from "./src/screens/Login";
import TrackingScreen from "./src/screens/Tracking";
import NotificationScreen from "./src/screens/Notification";
import ProfileScreen from "./src/screens/Profile";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PublicStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

const PrivateStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Notificaciones"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";
          let routeName = route.name;

          if (routeName === "Seguimiento") {
            iconName = focused ? "map" : "map-outline";
          }

          if (routeName === "Notificaciones") {
            iconName = focused ? "notifications" : "notifications-outline";
          }

          if (routeName === "Mi Perfil") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Seguimiento" component={TrackingScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Notificaciones" component={NotificationScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Mi Perfil" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const Router = () => {
  const { isAuth } = useAuthContext();

  return <NavigationContainer>{isAuth ? <PrivateStack /> : <PublicStack />}</NavigationContainer>;
};

export default function App() {
  return (
    <>
      <AuthContextProvider>
        <Router />
      </AuthContextProvider>

      <StatusBar style="auto" />
    </>
  );
}
