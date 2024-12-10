import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const DetallePedidosScreen = ({ route, navigation }) => {
  const { pedido } = route.params; // Recibimos el pedido desde los parámetros de navegación

  // Convertimos valores numéricos a enteros
  const pedidoConvertido = {
    ...pedido,
    id: parseInt(pedido.id, 10),
    total: parseInt(pedido.total, 10),
    items: pedido.items.map((item) => ({
      ...item,
      quantity: parseInt(item.quantity, 10),
      price: parseInt(item.price, 10),
    })),
  };

  const [estado, setEstado] = useState(pedidoConvertido.status); // Estado actual del pedido
  const [loading, setLoading] = useState(false); // Estado para mostrar el indicador de carga

  // Función para actualizar el estado del pedido
  const actualizarEstado = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://ef46-191-114-66-185.ngrok-free.app/orders/verificar-codigo/',
        {
          pickup_code: pedidoConvertido.pickup_code,
          phase: estado,
        }
      );
      Alert.alert('Éxito', `El estado se ha actualizado a "${estado}".`);
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del pedido. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Navegar a la pantalla de Verificación de Código
  const irAVerificacionCodigo = () => {
    navigation.navigate('VerificacionCodigo', { pickupCode: pedidoConvertido.pickup_code });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Detalles del Pedido</Text>
      <Text style={styles.info}>ID del Pedido: {pedidoConvertido.id}</Text>
      <Text style={styles.info}>Total: ${pedidoConvertido.total}</Text>
      <Text style={styles.info}>Estado actual: {pedidoConvertido.status}</Text>
      <Text style={styles.info}>
        Fecha de creación: {new Date(pedidoConvertido.created_at).toLocaleDateString()}
      </Text>

      <Text style={styles.subtitle}>Productos:</Text>
      {pedidoConvertido.items.map((item, index) => (
        <View key={index} style={styles.productContainer}>
          <Image source={{ uri: item.product.imagen_url }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.product.nombre}</Text>
            <Text style={styles.productDetails}>Cantidad: {item.quantity}</Text>
            <Text style={styles.productDetails}>Precio: ${item.price}</Text>
          </View>
        </View>
      ))}

      {/* Picker para seleccionar el estado */}
      <Text style={styles.pickerLabel}>Actualizar Estado:</Text>
      <Picker
        selectedValue={estado}
        style={styles.picker}
        onValueChange={(itemValue) => setEstado(itemValue)}
      >
        <Picker.Item label="En proceso" value="procesando" />
        <Picker.Item label="Recogiendo productos" value="recogiendo" />
        <Picker.Item label="Listo para retirar" value="listo" />
        <Picker.Item label="Entregado" value="entregado" />
      </Picker>

      {/* Botón para guardar el estado */}
      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" />
      ) : (
        <Button title="Actualizar Estado" onPress={actualizarEstado} color="#6200EE" />
      )}

      {/* Botón para verificar el código */}
      <View style={styles.verificarButton}>
        <Button title="Verificar Código" onPress={irAVerificacionCodigo} color="#03DAC5" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#6200EE',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productDetails: {
    fontSize: 14,
    color: '#555',
  },
  pickerLabel: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
    color: '#333',
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  verificarButton: {
    marginTop: 20,
  },
});

export default DetallePedidosScreen;
