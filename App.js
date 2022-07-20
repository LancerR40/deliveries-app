import { StatusBar } from "expo-status-bar";
import { Root } from 'react-native-alert-notification';

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import { AuthContextProvider, useAuthContext } from "./src/contexts/auth";
import { ShipmentContextProvider } from "./src/contexts/shipment"

import LoginScreen from "./src/screens/Login";
import TrackingScreen from "./src/screens/Tracking";
import ShipmentScreen from "./src/screens/Shipment";
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
    <ShipmentContextProvider>
      <Tab.Navigator
        initialRouteName="Notificaciones"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let routeName = route.name;
            let icon = null
            color = focused ? "#014AC1" : "gray";

            if (routeName === "Seguimiento") {
              icon = <MaterialCommunityIcons name="google-maps" size={size} color={color} />
            }

            if (routeName === "Envíos") {
              icon = <MaterialCommunityIcons name="truck" size={size} color={color} />
            }

            if (routeName === "Mi Perfil") {
              icon = <MaterialCommunityIcons name="google-maps" size={size} color={color} />
              icon = <FontAwesome name="user" size={size} color={color} />
            }

            return icon
          },
        })}
      >
        <Tab.Screen name="Seguimiento" component={TrackingScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Envíos" component={ShipmentScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Mi Perfil" component={ProfileScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </ShipmentContextProvider>
  );
};

const Router = () => {
  const { isAuth } = useAuthContext();

  return <NavigationContainer>{isAuth ? <PrivateStack /> : <PublicStack />}</NavigationContainer>;
};

export default function App() {
  return (
    <>
      <Root>
        <AuthContextProvider>
          <Router />
        </AuthContextProvider>
      </Root>

      <StatusBar style="inverted" />
    </>
  );
}
