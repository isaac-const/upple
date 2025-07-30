import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

type Report = {
  id: number;
  created_at: string;
  post: { id: string; name: string; image_url: string | null };
  reporter: { id: string; username: string };
};

const ManageReportsScreen = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchReports = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('reports')
          .select(`
            id, created_at,
            post:posts ( id, name, image_url ),
            reporter:profiles ( id, username )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          Alert.alert("Erro", "Não foi possível buscar as denúncias.");
        } else {
          setReports(data as Report[]);
        }
        setLoading(false);
      };

      fetchReports();
    }, [])
  );

  const handleDeletePost = (post: Report['post']) => {
    if(!post) {
      Alert.alert("Erro", "Este post já foi deletado.");
      const refetch = async () => {
          const { data } = await supabase.from('reports').select(`*,post:posts(*),reporter:profiles(*)`).order('created_at');
          setReports(data as Report[]);
      }
      refetch();
      return;
    }
    Alert.alert(
      "Confirmar Exclusão",
      `Você tem certeza que deseja excluir o post "${post.name}"? Isso também removerá todas as denúncias associadas a ele.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: async () => {
          if (post.image_url) {
            const filePath = post.image_url.split('/images/')[1];
            await supabase.storage.from('images').remove([filePath]);
          }
          const { error } = await supabase.from('posts').delete().eq('id', post.id);
          if (error) {
            Alert.alert("Erro ao excluir", error.message);
          } else {
            Alert.alert("Sucesso", "Post excluído.");
            const refetch = async () => {
                const { data } = await supabase.from('reports').select(`*,post:posts(*),reporter:profiles(*)`).order('created_at');
                setReports(data as Report[]);
            }
            refetch();
          }
        }}
      ]
    );
  };

  const renderItem = ({ item }: { item: Report }) => (
    <View style={styles.reportCard}>
      <View style={{flex: 1}}>
        <Text style={styles.reportText}>Post: <Text style={styles.reportHighlight}>{item.post?.name || 'Post deletado'}</Text></Text>
        <Text style={styles.reportText}>Denunciado por: <Text style={styles.reportHighlight}>@{item.reporter?.username || 'Usuário deletado'}</Text></Text>
        <Text style={styles.dateText}>{new Date(item.created_at).toLocaleString('pt-BR')}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => item.post && router.push(`/post/${item.post.id}`)}>
          <Ionicons name="eye-outline" size={24} color={Colors.textAction} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDeletePost(item.post)}>
          <Ionicons name="trash-outline" size={24} color={Colors.textDanger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.textPrimary} style={{flex: 1}}/>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma denúncia encontrada.</Text>}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  reportCard: {
    backgroundColor: Colors.componentBackground,
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  reportText: {
    color: Colors.white,
    fontSize: 14,
    flexShrink: 1,
  },

  reportHighlight: {
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },

  dateText: {
    color: Colors.placeholder,
    fontSize: 12,
    marginTop: 4,
  },

  actions: {
    flexDirection: 'row',
    gap: 15,
    marginLeft: 10,
  },

  actionButton: {
    padding: 5,
  },

  emptyText: {
    color: Colors.placeholder,
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});


export default ManageReportsScreen;