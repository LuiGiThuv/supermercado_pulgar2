import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';

export default function PedidosScreen({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('todos');

  // Función para obtener los pedidos del backend
  const obtenerPedidos = async () => {
    try {
      const response = await axios.get(
        'https://ef46-191-114-66-185.ngrok-free.app/orders/all-orders'
      );

      const pedidosConvertidos = response.data.map((pedido) => ({
        ...pedido,
        id: parseInt(pedido.id, 10),
        total: parseInt(pedido.total, 10),
      }));

      setPedidos(pedidosConvertidos);
      setPedidosFiltrados(pedidosConvertidos); // Inicialmente mostramos todos
    } catch (error) {
      console.error('Error al obtener los pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para filtrar pedidos por estado
  const filtrarPedidos = (estado) => {
    setEstadoSeleccionado(estado);
    if (estado === 'todos') {
      setPedidosFiltrados(pedidos);
    } else {
      setPedidosFiltrados(pedidos.filter((pedido) => pedido.status === estado));
    }
  };

  // Llamar a obtenerPedidos cuando se monta el componente
  useEffect(() => {
    obtenerPedidos();
  }, []);

  // Si está cargando, mostramos un indicador
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Historial de pedidos</Text>

      {/* Filtros por estado */}
      <View style={styles.filtrosContainer}>
        <ScrollView horizontal style={styles.barra}>
        {['todos', 'procesando', 'recogiendo', 'listo', 'entregado'].map((estado) => (
          <TouchableOpacity
            key={estado}
            style={[
              styles.filtroButton,
              estadoSeleccionado === estado && styles.filtroButtonSeleccionado,
            ]}
            onPress={() => filtrarPedidos(estado)}
          >
            <Text
              style={[
                styles.filtroText,
                estadoSeleccionado === estado && styles.filtroTextSeleccionado,
              ]}
            >
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
        </ScrollView>
      </View>
        
      
        <FlatList
          data={pedidosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.pedido}>
              <Text style={styles.pedidoText}>
                <Text style={styles.label}>ID Pedido:</Text> {item.id}
              </Text>
              <Text style={styles.pedidoText}>
                <Text style={styles.label}>Total:</Text> ${item.total}
              </Text>
              <Text style={styles.pedidoText}>
                <Text style={styles.label}>Estado:</Text> {item.status}
              </Text>
              <Text style={styles.pedidoText}>
                <Text style={styles.label}>Fecha:</Text>{' '}
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  title="Ver Detalles"
                  color="#22c55e"
                  onPress={() => navigation.navigate('DetallePedido', { pedido: item })}
                />
              </View>
            </View>
          )}
        />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  filtroButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  filtroButtonSeleccionado: {
    backgroundColor: '#6200ee',
  },
  filtroText: {
    fontSize: 14,
    color: '#333',
  },
  filtroTextSeleccionado: {
    color: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  pedido: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  pedidoText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#22c55e',
  },
  buttonContainer: {
    marginTop: 10,
  },
  barra:{
    padding: 10
  }
});
