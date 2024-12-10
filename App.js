import React from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import VerificacionCodigoScreen from './screens/VerificacionCodigoScreen';
import PedidosScreen from './screens/PedidosScreen'; // La pantalla de pedidos
import DetallePedidoScreen from './screens/DetallePedidoScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="VerificacionCodigo" component={VerificacionCodigoScreen} />
        <Stack.Screen name="Pedidos" component={PedidosScreen} />
        <Stack.Screen name="DetallePedido" component={DetallePedidoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
