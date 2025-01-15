import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MapSearchScreen from "./screens/MapSearchScreen";
import WeatherActivitiesScreen from "./screens/WeatherActivitiesScreen";
import "react-native-gesture-handler";
import WeatherForecastScreen from "./screens/WeatherForecastScreen";
import SuggestedActivitiesScreen from "./screens/SuggestedActivitiesScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MapSearch">
        <Stack.Screen
          name="MapSearch"
          component={MapSearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WeatherActivities"
          component={WeatherActivitiesScreen}
          options={{ title: "Weather & Activities" }}
        />
        <Stack.Screen
          name="WeatherForecast"
          component={WeatherForecastScreen}
          options={{ title: "7-Day Forecast" }}
        />
        <Stack.Screen
          name="SuggestedActivities"
          component={SuggestedActivitiesScreen}
          options={{ title: "Suggested Activities" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
