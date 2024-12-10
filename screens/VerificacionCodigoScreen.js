import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

const VerificacionCodigoScreen = ({ route }) => {
  const { pickupCode } = route.params; // Recibir el código de recogida
  const [codigo, setCodigo] = useState('');

  const handleVerificacion = () => {
    if (codigo === pickupCode) {
      Alert.alert('Éxito', 'El código es válido.');
    } else {
      Alert.alert('Error', 'El código es incorrecto.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Código de 4 dígitos"
        value={codigo}
        onChangeText={setCodigo}
        maxLength={4}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Verificar Código" onPress={handleVerificacion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
});

export default VerificacionCodigoScreen;
