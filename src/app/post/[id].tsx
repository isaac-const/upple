import { useLocalSearchParams, Stack } from 'expo-router';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity, Linking, TextInput, LayoutChangeEvent } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '../../components/PostCard';
import CommentCard, { Comment } from '../../components/CommentCard';
import { useAuth } from '../../lib/AuthContext';

type DetailedPost = Post & {
  github_link?: string | null;
  official_link?: string | null;
};

const PostDetailScreen = () => {
  const { id, scrollTo } = useLocalSearchParams<{ id: string, scrollTo?: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<DetailedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [userVote, setUserVote] = useState<any>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const [commentsSectionY, setCommentsSectionY] = useState(0);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data: postData, error: postError } = await supabase.from('posts').select(`*, profiles ( username )`).eq('id', id).single();
      if (postError) throw postError;
      const { data: commentsData, error: commentsError } = await supabase.from('comments').select(`*, profiles ( username, avatar_url )`).eq('post_id', id).order('created_at', { ascending: false });
      if (commentsError) throw commentsError;
      const { data: votesData, error: votesError, count } = await supabase.from('votes').select('*', { count: 'exact' }).eq('post_id', id);
      if (votesError) throw votesError;
      const currentUserVote = votesData.find(v => v.user_id === user?.id);
      setPost(postData as DetailedPost);
      setComments(commentsData as Comment[]);
      setVoteCount(count ?? 0);
      setUserVote(currentUserVote);
    } catch (error: any) {
      Alert.alert("Erro ao buscar dados", error.message);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (scrollTo === 'comments' && !loading && commentsSectionY > 0) {
      scrollToComments();
    }
  }, [loading, scrollTo, commentsSectionY]);

  const scrollToComments = () => {
    scrollViewRef.current?.scrollTo({ y: commentsSectionY, animated: true });
  };

  const handleVote = async () => {
    if (!user) { Alert.alert("Ação necessária", "Você precisa estar logado para votar."); return; }
    if (userVote) {
      const { error } = await supabase.from('votes').delete().match({ id: userVote.id });
      if (error) { Alert.alert("Erro", "Não foi possível remover o voto."); } else { setUserVote(null); setVoteCount(prev => prev - 1); }
    } else {
      const { data, error } = await supabase.from('votes').insert({ post_id: id, user_id: user.id }).select().single();
      if (error) { Alert.alert("Erro", "Não foi possível registrar o voto."); } else { setUserVote(data); setVoteCount(prev => prev + 1); }
    }
  };

  const handleAddComment = async () => {
    if (!user) { Alert.alert("Ação necessária", "Você precisa estar logado para comentar."); return; }
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    const { data, error } = await supabase.from('comments').insert({ post_id: id, user_id: user.id, content: newComment }).select(`*, profiles ( username, avatar_url )`).single();
    setIsSubmitting(false);
    if (error) { Alert.alert("Erro", "Não foi possível adicionar o comentário."); } else { setComments(prev => [data as Comment, ...prev]); setNewComment(''); }
  };
  
  const handleReport = () => {
    if (!user) {
      Alert.alert("Ação necessária", "Você precisa estar logado para denunciar.");
      return;
    }
    if (!post) return;
    Alert.alert(
      "Denunciar Post",
      `Você tem certeza que deseja denunciar "${post.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar Denúncia",
          onPress: async () => {
            const { error } = await supabase
              .from('reports')
              .insert({ post_id: post.id, reporter_id: user.id });

            if (error) {
              Alert.alert("Erro", "Não foi possível enviar sua denúncia.");
            } else {
              Alert.alert("Denúncia Recebida", "Obrigado! Nossa equipe irá analisar o post.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const openLink = async (url: string | null | undefined) => {
    if (!url) return;
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url); else Alert.alert(`Não foi possível abrir a URL: ${url}`);
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.textPrimary} /></View>;
  if (!post) return <View style={styles.centered}><Text style={styles.title}>Post não encontrado.</Text></View>;

  const hasComments = comments.length > 0;

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      <Stack.Screen options={{ title: post.name }} />
      <View style={styles.imageContainer}><Image source={post.image_url ? { uri: post.image_url } : require('../../../assets/images/icon.png')} style={styles.logo} /></View>
      <View style={styles.detailsContainer}>
        <View style={styles.titleHeader}><Text style={styles.title}>{post.name}</Text><View style={[styles.tag, post.type === 'APP' ? styles.appTag : styles.softwareTag]}><Text style={styles.tagText}>{post.type}</Text></View></View>
        <View style={styles.statsBar}>
          <TouchableOpacity style={[styles.stat, userVote ? styles.votedButton : {}]} onPress={handleVote}>
            <Ionicons name={userVote ? "arrow-up" : "arrow-up-outline"} size={14} color={userVote ? Colors.black : Colors.textPrimary} />
            <Text style={[styles.statTextHighlight, userVote ? { color: Colors.black } : {}]}>{voteCount} votos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.stat, hasComments && styles.hasCommentsButton]} onPress={scrollToComments}>
            <Ionicons name="chatbubble-ellipses-outline" size={14} color={hasComments ? Colors.textAction : Colors.placeholder} />
            <Text style={[styles.statText, hasComments && { color: Colors.textAction }]}>{comments.length} comentários</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
            <Ionicons name="flag-outline" size={14} color={Colors.textDanger} />
            <Text style={styles.reportText}>Reportar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}><Text style={styles.sectionTitle}>Descrição</Text><Text style={styles.description}>{post.description}</Text></View>
      {(post.github_link || post.official_link) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Links</Text>
          {post.github_link && <TouchableOpacity style={styles.linkButton} onPress={() => openLink(post.github_link)}><Ionicons name="logo-github" size={20} color={Colors.white} /><Text style={styles.linkText}>Github</Text><Ionicons name="open-outline" size={18} color={Colors.placeholder} /></TouchableOpacity>}
          {post.official_link && <TouchableOpacity style={styles.linkButton} onPress={() => openLink(post.official_link)}><Ionicons name="globe-outline" size={20} color={Colors.white} /><Text style={styles.linkText}>Site Oficial</Text><Ionicons name="open-outline" size={18} color={Colors.placeholder} /></TouchableOpacity>}
        </View>
      )}
      <View style={styles.section} onLayout={(event: LayoutChangeEvent) => { setCommentsSectionY(event.nativeEvent.layout.y); }}>
        <Text style={styles.sectionTitle}>Comentários</Text>
        <View style={styles.commentInputContainer}>
          <TextInput style={styles.commentInput} placeholder="Adicione um comentário..." placeholderTextColor={Colors.placeholder} value={newComment} onChangeText={setNewComment} multiline />
          <TouchableOpacity onPress={handleAddComment} disabled={isSubmitting}><Ionicons name="send" size={24} color={Colors.textPrimary} /></TouchableOpacity>
        </View>
        {comments.map(comment => <CommentCard key={comment.id} comment={comment} />)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  imageContainer: {
    backgroundColor: Colors.componentBackground,
    paddingVertical: 30,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  detailsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.componentBorder,
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  tag: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 10,
  },
  appTag: {
    backgroundColor: '#3A5944',
  },
  softwareTag: {
    backgroundColor: '#294652',
  },
  tagText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  votedButton: {
    backgroundColor: Colors.buttonPrimaryBackground,
  },
  hasCommentsButton: {
    borderColor: Colors.textAction,
  },
  statText: {
    color: Colors.placeholder,
    marginLeft: 6,
    fontWeight: '600',
  },
  statTextHighlight: {
    color: Colors.textPrimary,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
    marginLeft: 'auto',
  },
  reportText: {
    color: Colors.textDanger,
    marginLeft: 6,
    fontWeight: '600',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 24,
  },
  linkButton: {
    backgroundColor: Colors.inputBackground,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  linkText: {
    color: Colors.white,
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
    paddingHorizontal: 8,
    maxHeight: 100,
  },
});
export default PostDetailScreen;
