import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { useFocusEffect, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import StyledButton from '../../components/StyledButton';
import { Post } from '../../components/PostCard';
import MyPostCard from '../../components/MyPostCard';

const ProfileScreen = () => {
  const { user } = useAuth();
  const router = useRouter(); 
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<{ username: string } | null>(null);

  const fetchProfileData = async () => {
    
    if (!user) return;
    setLoading(true);
    try {
      const { data: profileData, error: profileError } = await supabase.from('profiles').select('username').eq('id', user.id).single();
      if (profileError) throw profileError;
      setProfile(profileData);
      const { data: postsData, error: postsError } = await supabase.from('posts').select(`*, profiles ( username ), votes ( count ), comments ( count )`).eq('user_id', user.id).order('created_at', { ascending: false });
      if (postsError) throw postsError;
      setUserPosts(postsData as Post[]);
    } catch (error: any) { Alert.alert("Erro ao buscar dados", error.message);
    } finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { fetchProfileData(); }, [user]));

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
  };

  const handleEdit = (post: Post) => {
    router.push({
      pathname: '/edit-post',
      params: { post: JSON.stringify(post) }
    });
  };

  const handleDelete = (postId: string, imageUrl: string | null | undefined) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: async () => {
          
          if (imageUrl) {
            const filePath = imageUrl.split('/images/')[1];
            const { error: storageError } = await supabase.storage.from('images').remove([filePath]);
            if (storageError) {
              Alert.alert("Erro", "Não foi possível deletar a imagem associada.");
            }
          }

        
          const { error } = await supabase.from('posts').delete().match({ id: postId });
          if (error) {
            Alert.alert("Erro ao excluir", error.message);
          } else {
            
            setUserPosts(currentPosts => currentPosts.filter(p => p.id !== postId));
            Alert.alert("Sucesso", "Post excluído.");
          }
        }}
      ]
    );
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.textPrimary} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>{profile?.username?.[0].toUpperCase()}</Text></View>
        <Text style={styles.username}>{profile?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      <View style={styles.buttonContainer}><StyledButton title="Sair da Conta" onPress={handleLogout} /></View>
      <View style={styles.postsSection}>
        <Text style={styles.sectionTitle}>Meus Posts</Text>
        {userPosts.length > 0 ? (
          userPosts.map(post => 
            <MyPostCard 
              key={post.id} 
              post={post} 
              onEdit={() => handleEdit(post)} 
              onDelete={() => handleDelete(post.id, post.image_url)}
            />
          )
        ) : (
          <Text style={styles.noPostsText}>Você ainda não criou nenhum post.</Text>
        )}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  profileHeader: { alignItems: 'center', paddingVertical: 30, borderBottomWidth: 1, borderBottomColor: Colors.componentBorder },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.componentBackground, justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: Colors.componentBorder },
  avatarText: { color: Colors.textPrimary, fontSize: 48, fontWeight: 'bold' },
  username: { color: Colors.white, fontSize: 24, fontWeight: 'bold' },
  email: { color: Colors.placeholder, fontSize: 16, marginTop: 4 },
  buttonContainer: { paddingHorizontal: 20, marginTop: 20 },
  postsSection: { padding: 20 },
  sectionTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
  noPostsText: { color: Colors.placeholder, textAlign: 'center', marginTop: 20, fontSize: 16 },
});
export default ProfileScreen;