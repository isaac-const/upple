import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '../../components/PostCard';

const ManagePostsScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        setLoading(true);
        let query = supabase
          .from('posts')
          .select(`*, profiles ( username )`);

        if (search.trim()) {
          query = query.or(`name.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          Alert.alert("Erro", "Não foi possível buscar os posts.");
          console.error(error);
        } else {
          setPosts(data as Post[]);
        }
        setLoading(false);
      };

      fetchPosts();
    }, [search])
  );

  //função pra deletar post
  const handleDeletePost = (post: Post) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Você tem certeza que deseja excluir o post "${post.name}"? Esta ação é irreversível e deletará todos os seus votos e comentários.`,
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
            setPosts(currentPosts => currentPosts.filter(p => p.id !== post.id));
          }
        }}
      ]
    );
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <Image 
        source={item.image_url ? { uri: item.image_url } : require('../../../assets/images/icon.png')}
        style={styles.logo}
      />
      <View style={styles.postInfo}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.author}>por @{item.profiles?.username || 'desconhecido'}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDeletePost(item)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color={Colors.textDanger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Pesquisar por nome ou descrição..."
          placeholderTextColor={Colors.placeholder}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.textPrimary} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum post encontrado.</Text>}
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
  postCard: {
    backgroundColor: Colors.componentBackground,
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  postInfo: { flex: 1 },
  title: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  author: { color: Colors.placeholder, fontSize: 14 },
  deleteButton: {
    padding: 8,
  },
  emptyText: { color: Colors.placeholder, textAlign: 'center', marginTop: 50 },
});

export default ManagePostsScreen;