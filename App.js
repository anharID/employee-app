import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import EmployeeListScreen from './screens/EmployeeListScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [userToken, setUserToken] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkStorage = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const storedUsername = await AsyncStorage.getItem('username');
      setUserToken(token);
      setUsername(storedUsername || '');
    };
    checkStorage();
  }, []);

  const setToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem('userToken', token);
    } else {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('username');
      setUsername('');
    }
    setUserToken(token);
  };

  const setUsernameInStorage = async (name) => {
    setUsername(name);
    if (name) {
      await AsyncStorage.setItem('username', name);
    } else {
      await AsyncStorage.removeItem('username');
    }
  };

  const HomeTabs = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'EmployeeList') {
            iconName = 'people-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home">
        {props => <HomeScreen {...props} username={username} logout={() => setToken(null)} />}
      </Tab.Screen>
      <Tab.Screen name="EmployeeList" component={EmployeeListScreen} />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {userToken ? (
          <>
            <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
          </>
        ) : (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {props => <LoginScreen {...props} setUsername={setUsernameInStorage} setToken={setToken} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
