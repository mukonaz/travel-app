import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { OPENWEATHER_APIKEY, GOOGLE_APIKEY } from "@env";
import { MaterialCommunityIcons } from "react-native-vector-icons";

const WeatherForecastScreen = ({ route }) => {
  const { latitude, longitude } = route.params;
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [activeDay, setActiveDay] = useState(null);

  useEffect(() => {
    fetchForecast();
  }, [latitude, longitude]);

  const fetchForecast = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_APIKEY}&units=metric`
      );
      const data = await response.json();
      if (data.list) {
        const dailyData = data.list.filter((entry) =>
          entry.dt_txt.includes("12:00:00")
        );
        setForecast(dailyData);
      }
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async (lat, lon, weatherCondition) => {
    const type = getActivityTypeBasedOnWeather(weatherCondition);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=25000&type=${type}&key=${GOOGLE_APIKEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setActivities(data.results);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const getActivityTypeBasedOnWeather = (condition) => {
    if (condition === "clear") return "park";
    if (condition.includes("cloud")) return "museum";
    if (condition.includes("rain") || condition.includes("drizzle")) return "movie_theater";
    if (condition.includes("snow") || condition.includes("cold")) return "cafe";
    return "tourist_attraction";
  };

  const handleDayPress = async (day) => {
    setLoading(true);
    setActiveDay(day.dt); // Mark this day as active
    await fetchActivities(latitude, longitude, day.weather[0].main.toLowerCase());
    setLoading(false);
  };

  const renderWeatherIcon = (condition) => {
    switch (condition) {
      case "clear":
        return <MaterialCommunityIcons name="weather-sunny" size={24} color="#FFAA00" />;
      case "clouds":
        return <MaterialCommunityIcons name="weather-cloudy" size={24} color="#777777" />;
      case "rain":
        return <MaterialCommunityIcons name="weather-rainy" size={24} color="#0000FF" />;
      case "snow":
        return <MaterialCommunityIcons name="weather-snowy" size={24} color="#FFFFFF" />;
      default:
        return <MaterialCommunityIcons name="weather-cloudy" size={24} color="#777777" />;
    }
  };

  const renderActivity = ({ item }) => (
    <View style={styles.activityItem}>
      {item.photos && item.photos[0] && (
        <Image
          style={styles.activityImage}
          source={{
            uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${GOOGLE_APIKEY}`,
          }}
        />
      )}
      <Text style={styles.activityName}>{item.name}</Text>
      <Text style={styles.activityAddress}>{item.vicinity}</Text>
      {item.rating && (
        <Text style={styles.activityRating}>
          Rating: {item.rating}⭐
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>7-Day Weather Forecast</Text>
      {loading && !forecast.length ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FlatList
            data={forecast}
            keyExtractor={(item) => item.dt.toString()}
            
      
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.dayContainer,
                  activeDay === item.dt && styles.activeDayContainer,
                ]}
                onPress={() => handleDayPress(item)}
              >
                {renderWeatherIcon(item.weather[0].main.toLowerCase())}
                <Text style={styles.dayText}>
                  {new Date(item.dt * 1000).toDateString()}
                </Text>
                <Text style={styles.tempText}>
                  {Math.round(item.main.temp)}°C - {item.weather[0].description}
                </Text>
              </TouchableOpacity>
            )}
          />

          {activities.length > 0 ? (
            <FlatList
              data={activities}
              keyExtractor={(item) => item.place_id}
              renderItem={renderActivity}
              style={styles.activityList}
            />
          ) : (
            <Text style={styles.noActivitiesMessage}>
              click on a day to see nearby activities
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#444",
  },
  dayContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  activeDayContainer: {
    borderWidth: 2,
    borderColor: "#FFAA00",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 4,
  },
  tempText: {
    fontSize: 14,
    color: "#777",
  },
  activityList: {
    marginTop: 16,
  },
  activityItem: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  activityImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  activityName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  activityAddress: {
    fontSize: 14,
    color: "#777",
  },
  activityRating: {
    fontSize: 14,
    color: "#FFAA00",
  },
  noActivitiesMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
});

export default WeatherForecastScreen;
