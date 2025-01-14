// screens/WeatherActivitiesScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import "react-native-gesture-handler";
import { OPENWEATHER_APIKEY } from "@env";

const OPENWEATHER_API_KEY = OPENWEATHER_APIKEY;

const activities = {
  sunny: ["Visit a park", "Outdoor sightseeing", "Beach day", "Hiking"],
  cloudy: ["Museum tour", "Indoor dining", "Library visit", "Shopping mall"],
  rainy: ["Art gallery", "Movie theater", "Bowling", "Cooking class"],
  cold: ["Spa day", "Hot chocolate café", "Indoor pool", "Cozy bookstore"],
};

const WeatherActivitiesScreen = ({ route }) => {
  const { cityName } = route.params;
  const [weather, setWeather] = useState(null);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, [cityName]);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
        filterActivities(data.weather[0].main.toLowerCase());
      } else {
        alert("City not found");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = (condition) => {
    let selectedActivities = [];
    if (condition === "clear") {
      selectedActivities = activities.sunny;
    } else if (condition.includes("cloud")) {
      selectedActivities = activities.cloudy;
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      selectedActivities = activities.rainy;
    } else if (condition.includes("snow") || condition.includes("cold")) {
      selectedActivities = activities.cold;
    } else {
      selectedActivities = [
        ...activities.sunny,
        ...activities.cloudy,
        ...activities.rainy,
        ...activities.cold,
      ];
    }
    setFilteredActivities(selectedActivities);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {weather && (
        <View style={styles.weatherInfo}>
          <Text style={styles.cityName}>{weather.name}</Text>
          <Text style={styles.temperature}>
            {Math.round(weather.main.temp)}°C
          </Text>
          <Text style={styles.weatherDescription}>
            {weather.weather[0].description}
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Recommended Activities</Text>
      <FlatList
        data={filteredActivities}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  weatherInfo: {
    alignItems: "center",
    marginVertical: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  cityName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  temperature: {
    fontSize: 48,
    fontWeight: "200",
    marginBottom: 8,
  },
  weatherDescription: {
    fontSize: 18,
    color: "#666",
    textTransform: "capitalize",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
  },
  activityItem: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  activityText: {
    fontSize: 16,
  },
});

export default WeatherActivitiesScreen;
