import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StyledButton from '../../components/StyledButton';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/Colors';
import { Link } from 'expo-router';

const AdminDashboard = () => {
  const { username } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel de Admin</Text>
      <Text style={styles.subtitle}>Bem-vindo(a), {username || 'Admin'}.</Text>

      <View style={styles.menu}>
        <Link href="/(admin)/posts" asChild>
          <StyledButton title="Gerenciar Posts" />
        </Link>
        <Link href="/(admin)/users" asChild>
          <StyledButton title="Gerenciar Usuários" />
        </Link>
        <Link href="/(admin)/reports" asChild>
          <StyledButton title="Ver Denúncias" />
        </Link>
      </View>

      <StyledButton
        title="Sair (Logout)"
        onPress={() => supabase.auth.signOut()}
        style={{ marginTop: 'auto', backgroundColor: Colors.background, borderColor: Colors.textDanger }}
        textStyle={{ color: Colors.textDanger }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.placeholder,
    textAlign: 'center',
    marginBottom: 40,
  },
  menu: {
    gap: 0.1,
  },
});


export default AdminDashboard;