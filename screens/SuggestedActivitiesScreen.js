import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SuggestedActivitiesScreen = ({ route }) => {
  const { weatherCondition } = route.params;

  const getActivityTypeBasedOnWeather = (condition) => {
    if (condition === "clear") return "Park or outdoor activities";
    if (condition.includes("cloud")) return "Museum or indoor sightseeing";
    if (condition.includes("rain") || condition.includes("drizzle")) return "Movie theaters";
    if (condition.includes("snow") || condition.includes("cold")) return "Cozy indoor places (e.g., cafes)";
    return "Tourist attractions";
  };

  const suggestedActivity = getActivityTypeBasedOnWeather(weatherCondition);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggested Activities</Text>
      <Text style={styles.suggestion}>
        Based on the weather condition "{weatherCondition}", we recommend: {suggestedActivity}.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#444",
  },
  suggestion: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default SuggestedActivitiesScreen;
