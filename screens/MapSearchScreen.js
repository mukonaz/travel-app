import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_APIKEY } from "@env";
import { MaterialIcons } from "react-native-vector-icons";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const MapSearchScreen = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 37.4221,
    longitude: -122.0841,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);

  const handlePlaceSelect = (data, details = null) => {
    if (details?.geometry?.location) {
      const { lat, lng } = details.geometry.location;

      setRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setSelectedLocation({
        latitude: lat,
        longitude: lng,
        name: details.name,
        address: details.formatted_address,
      });

      navigation.navigate("Weather Activities", {
        cityName: details.name,
        latitude: lat,
        longitude: lng,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search for a place"
          fetchDetails={true}
          onPress={handlePlaceSelect}
          query={{
            key: GOOGLE_APIKEY,
            language: "en",
          }}
          styles={{
            container: styles.autocompleteContainer,
            textInput: styles.textInput,
            listView: styles.listView,
          }}
          enablePoweredByContainer={false}
          keyboardShouldPersistTaps="handled"
          listViewDisplayed={false}
        />
      </View>

      <MapView style={styles.map} region={region}>
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title={selectedLocation.name}
            description={selectedLocation.address}
          />
        )}
      </MapView>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.floatingActionButton}>
          <MaterialIcons name="my-location" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatingActionButton}>
          <MaterialIcons name="search" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Find places and activities near you!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchBarContainer: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    zIndex: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#ffffff",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  autocompleteContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  textInput: {
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    paddingLeft: 20,
    fontSize: 16,
    color: "#555",
  },
  listView: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginTop: 5,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  actionButtonsContainer: {
    position: "absolute",
    bottom: 60,
    right: 20,
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  floatingActionButton: {
    backgroundColor: "#FFAA00",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    zIndex: 2,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    backgroundColor: "#FFAA00",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
});

export default MapSearchScreen;
