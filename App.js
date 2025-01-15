import React from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from 'react-native-vector-icons';

import MapSearchScreen from './screens/MapSearchScreen';
import WeatherActivitiesScreen from './screens/WeatherActivitiesScreen';
import WeatherForecastScreen from './screens/WeatherForecastScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Create a context to manage the selected location
export const LocationContext = React.createContext();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { locationData } = React.useContext(LocationContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Map Search':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Weather Activities':
              iconName = focused ? 'sunny' : 'sunny-outline';
              break;
            case 'Weather Forecast':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: 'flex',
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
      })}
    >
      <Tab.Screen 
        name="Map Search" 
        component={MapSearchScreen}
      />
      <Tab.Screen 
        name="Weather Activities" 
        component={WeatherActivitiesScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!locationData || !locationData.latitude) {
              e.preventDefault();
              Alert.alert(
                'Location Required',
                'Please select a location from the Map Search first.',
                [{ text: 'OK' }]
              );
              navigation.navigate('Map Search');
            }
          },
        })}
      />
      <Tab.Screen 
        name="Weather Forecast" 
        component={WeatherForecastScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!locationData || !locationData.latitude) {
              e.preventDefault();
              Alert.alert(
                'Location Required',
                'Please select a location from the Map Search first.',
                [{ text: 'OK' }]
              );
              navigation.navigate('Map Search');
            }
          },
        })}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [locationData, setLocationData] = React.useState(null);

  return (
    <LocationContext.Provider value={{ locationData, setLocationData }}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="MainTabs"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LocationContext.Provider>
  );
};

export default App;