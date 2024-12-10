import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';

// Configuración del manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Solicitar permisos y registrar el token
export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Error', 'No se otorgaron permisos para notificaciones.');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Token de notificación:', token);

    // Envía el token al backend para asociarlo con el usuario o dispositivo
    await sendTokenToBackend(token);
  } else {
    Alert.alert('Error', 'Debes usar un dispositivo físico para recibir notificaciones.');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};

// Enviar token al backend
const sendTokenToBackend = async (token) => {
  try {
    await fetch('https://tu-backend.com/api/register-push-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    console.log('Token registrado en el backend.');
  } catch (error) {
    console.error('Error al registrar el token en el backend:', error);
  }
};
