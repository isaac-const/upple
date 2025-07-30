import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import StyledInput from '../../components/StyledInput';
import StyledButton from '../../components/StyledButton';
import { Colors } from '../../constants/Colors';
import { Link, useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signUpWithEmail() {
    if (!username.trim() || !email.trim() || !password.trim()) {
        Alert.alert("Campos incompletos", "Por favor, preencha todos os campos.");
        return;
    }

    setLoading(true);
    const { data: { user }, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      Alert.alert('Erro no Cadastro', error.message);
    } else if (user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: user.id, username: username, email: email });

      if (profileError) {
        Alert.alert('Erro ao criar perfil', profileError.message);
      } else {
        Alert.alert(
          'Cadastro realizado!',
          'Seja bem-vindo(a)!',
        );
      }
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
        <Text style={styles.title}>Crie a sua Conta</Text>
        <StyledInput
          placeholder="Nome de Usuário..."
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
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
          title="Cadastrar"
          onPress={signUpWithEmail}
          loading={loading}
        />
        <Text style={styles.termsText}>
          Ao se cadastrar, você concorda com nossos{' '}
          <Link href="/(auth)/terms" asChild>
            <Text style={styles.linkText}>Termos de Uso.</Text>
          </Link>
        </Text>
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
    termsText: {
        color: Colors.placeholder,
        textAlign: 'center',
        marginTop: 15,
        paddingHorizontal: 10,
    },
    linkText: {
        color: Colors.textAction,
    },
});