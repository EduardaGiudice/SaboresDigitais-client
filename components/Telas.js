import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Feed from "../screens/Feed";
import Registro from "../screens/auth/Registro";
import Login from "../screens/auth/Login";
import NovoPost from "../screens/NovoPost";
import ListaCompras from "../screens/ListaCompras";
import Perfil from "../screens/Perfil";
import MeusPosts from "../screens/MeusPosts";
import Comentarios from "../screens/Comentarios";
import { AuthContext } from "../context/authContext";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { NavigationContainer } from "@react-navigation/native";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Telas = () => {
  const [state] = useContext(AuthContext);
  const usuarioautenticado = state?.usuario && state?.token;

  if (usuarioautenticado) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Comentarios"
          component={Comentarios}
          options={{
            title: "Comentários",
            headerStyle: {
              backgroundColor: "#F27507",
              height: responsiveHeight(8),
            },
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Registro"
        component={Registro}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarLabel: () => null,
      tabBarActiveTintColor: "#F27507",
      tabBarInactiveTintColor: "#000",
    }}
  >
    <Tab.Screen
      name="Feed"
      component={Feed}
      options={{
        title: "Feed de Receitas",
        headerStyle: {
          backgroundColor: "#F27507",
          height: responsiveHeight(10),
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="home" style={[styles.icon, { color: color }]} />
        ),
      }}
    />
    <Tab.Screen
      name="NovoPost"
      component={NovoPost}
      options={{
        title: "Novo Post",
        headerStyle: {
          backgroundColor: "#F27507",
          height: responsiveHeight(10),
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarIcon: ({ color }) => (
          <FontAwesome5
            name="plus-square"
            style={[styles.icon, { color: color }]}
          />
        ),
      }}
    />
    <Tab.Screen
      name="MeusPosts"
      component={MeusPosts}
      options={{
        title: "Meus Posts",
        headerStyle: {
          backgroundColor: "#F27507",
          height: responsiveHeight(10),
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="list" style={[styles.icon, { color: color }]} />
        ),
      }}
    />
    <Tab.Screen
      name="ListaCompras"
      component={ListaCompras}
      options={{
        title: "Lista de Compras",
        headerStyle: {
          backgroundColor: "#F27507",
          height: responsiveHeight(10),
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarIcon: ({ color }) => (
          <FontAwesome
            name="shopping-basket"
            style={[styles.icon, { color: color }]}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Perfil"
      component={Perfil}
      options={{
        title: "Perfil",
        headerStyle: {
          backgroundColor: "#F27507",
          height: responsiveHeight(10),
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarIcon: ({ color }) => (
          <FontAwesome name="user" style={[styles.icon, { color: color }]} />
        ),
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(1),
  },
  button: {
    paddingVertical: responsiveHeight(1.3),
    paddingHorizontal: responsiveWidth(4),
  },
  icon: {
    fontSize: responsiveFontSize(3),
  },
});

export default Telas;
