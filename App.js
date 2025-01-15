import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "react-native-vector-icons";

import MapSearchScreen from "./screens/MapSearchScreen";
import WeatherActivitiesScreen from "./screens/WeatherActivitiesScreen";
import WeatherForecastScreen from "./screens/WeatherForecastScreen";
import SuggestedActivitiesScreen from "./screens/SuggestedActivitiesScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "MapSearch") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "WeatherActivities") {
            iconName = focused ? "cloud" : "cloud-outline";
          } else if (route.name === "WeatherForecast") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "SuggestedActivities") {
            iconName = focused ? "sports" : "sports-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="MapSearch" component={MapSearchScreen} />
      <Tab.Screen name="WeatherActivities" component={WeatherActivitiesScreen} />
      <Tab.Screen name="WeatherForecast" component={WeatherForecastScreen} />
     
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MapSearch">
        <Stack.Screen
          name="MapSearch"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
