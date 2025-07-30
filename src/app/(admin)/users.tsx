import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/Colors';
import StyledButton from '../../components/StyledButton';
import { useAuth } from '../../lib/AuthContext';

type Profile = {
  id: string;
  username: string;
  email: string;
  role: string;
};

const ManageUsersScreen = () => {
  const { user } = useAuth(); 
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      const fetchProfiles = async () => {
        setLoading(true);
        let query = supabase.from('profiles').select('*');

        if (search.trim()) {
          query = query.ilike('username', `%${search.trim()}%`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          Alert.alert("Erro", "Não foi possível buscar os perfis.");
          console.error(error);
        } else {
          setProfiles(data);
        }
        setLoading(false);
      };
      
      fetchProfiles();
    }, [search])
  );

  const handleToggleAdmin = (profile: Profile) => {
    const newRole = profile.role === 'admin' ? 'user' : 'admin';
    const actionText = newRole === 'admin' ? 'promover' : 'rebaixar';

    Alert.alert(
      `Confirmar Ação`,
      `Você tem certeza que deseja ${actionText} o usuário "${profile.username}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: async () => {
          const { error } = await supabase.rpc('change_user_role', {
            target_user_id: profile.id,
            new_role: newRole
          });

          if (error) {
            Alert.alert("Erro ao alterar cargo", error.message);
          } else {
            Alert.alert("Sucesso", `Usuário ${actionText} com sucesso.`);
            setProfiles(currentProfiles => 
              currentProfiles.map(p => 
                p.id === profile.id ? { ...p, role: newRole } : p
              )
            );
          }
        }}
      ]
    );
  };

  const handleDeleteUser = (profile: Profile) => {
    if (profile.role === 'admin') {
      Alert.alert("Ação não permitida", "Não é possível excluir outro administrador.");
      return;
    }
    Alert.alert(
      "Confirmar Exclusão",
      `Você tem certeza que deseja excluir o usuário "${profile.username}" (${profile.email})? Esta ação é irreversível.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: async () => {
          const { error } = await supabase.rpc('delete_user', {
            target_user_id: profile.id
          });
          if (error) {
            Alert.alert("Erro ao excluir", error.message);
          } else {
            Alert.alert("Sucesso", "Usuário excluído.");
            setProfiles(currentProfiles => currentProfiles.filter(p => p.id !== profile.id));
          }
        }}
      ]
    );
  };

  const renderItem = ({ item }: { item: Profile }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username} {item.role === 'admin' && <Text style={{color: Colors.textPrimary}}>(Admin)</Text>}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        {/* Lógica do novo botão de promover/rebaixar */}
        <StyledButton 
          title={item.role === 'admin' ? "Remover Admin" : "Tornar Admin"}
          onPress={() => handleToggleAdmin(item)}
          disabled={user?.id === item.id} // Desabilita o botão para o próprio admin
          style={[styles.actionButton, user?.id === item.id && styles.disabledButton]}
          textStyle={styles.actionButtonText}
        />
        <StyledButton 
          title="Excluir" 
          onPress={() => handleDeleteUser(item)}
          style={styles.deleteButton}
          textStyle={styles.deleteButtonText}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Pesquisar por username..."
          placeholderTextColor={Colors.placeholder}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.textPrimary} />
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum perfil encontrado.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 10 },
  searchContainer: { paddingBottom: 10 },
  input: {
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: Colors.white,
    fontSize: 16,
  },
  userCard: {
    backgroundColor: Colors.componentBackground,
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
  },
  userInfo: { marginBottom: 10 },
  username: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  email: { color: Colors.placeholder, fontSize: 14 },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.inputBorder,
    paddingTop: 10,
  },
  actionButton: {
    backgroundColor: 'transparent',
    borderColor: Colors.textAction,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  actionButtonText: { color: Colors.textAction, fontWeight: 'normal', fontSize: 14 },
  deleteButton: {
    backgroundColor: 'transparent',
    borderColor: Colors.dangerBorder,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  deleteButtonText: { color: Colors.textDanger, fontWeight: 'normal', fontSize: 14 },
  disabledButton: {
    borderColor: Colors.placeholder,
    opacity: 0.5,
  },
  emptyText: { color: Colors.placeholder, textAlign: 'center', marginTop: 50 },
});

export default ManageUsersScreen;