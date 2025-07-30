import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import StyledInput from '../../components/StyledInput';
import StyledButton from '../../components/StyledButton';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    if (!email.trim() || !password.trim()) {
        Alert.alert("Campos incompletos", "Por favor, preencha seu email e senha.");
        return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Erro no Login', 'Email ou senha inválidos. Tente novamente.');
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.backButton}>Voltar</Text>
            </TouchableOpacity>
        </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Entre em sua Conta</Text>
        <StyledInput
          placeholder="Insira seu Email..."
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <StyledInput
          placeholder="Insira sua Senha..."
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <StyledButton
          title="Entrar"
          onPress={signInWithEmail}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
    },
    header: {
        position: 'absolute',
        top: 60,
        left: 20,
    },
    backButton: {
        color: Colors.textAction,
        fontSize: 16,
    },
    formContainer: {
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 20,
    },
});