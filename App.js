import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRegistry } from 'react-native';
import Auth from './pages/Auth'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import NewTask from './pages/NewTask'
import ViewTasks from './pages/ViewTasks'

AppRegistry.registerComponent('FirebaseAuth', () => App);
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Auth'
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFB3E2' }
      }}>
        <Stack.Screen name='Auth' component={Auth} />
        <Stack.Screen name='SignIn' component={SignIn} />
        <Stack.Screen name='SignUp' component={SignUp} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='NewTask' component={NewTask} />
        <Stack.Screen name='ViewTasks' component={ViewTasks} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}