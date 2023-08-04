import React, {Component} from 'react';
import {View} from 'react-native';
import Screen from './component/screen';
import Screen2 from './component/Screen2';
import Screen3 from './component/Screen3';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();
class App extends Component {
   render() {
       return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Screen">
            <Stack.Screen name="Screen" component={Screen} options={{ headerShown: false }} /> 
            <Stack.Screen name="Screen2" component={Screen2} options={{ headerShown: false }} /> 
            <Stack.Screen name="Screen3" component={Screen3} options={{ headerShown: false }} /> 
            </Stack.Navigator>
        </NavigationContainer>
    //    <View>
    //        <Screen />
                     
    //    </View>
       );
   }
}

export default App;