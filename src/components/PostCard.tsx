import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export type Post = {
  id: string;
  name: string;
  description: string;
  type: 'APP' | 'SOFTWARE';
  image_url?: string | null;
  created_at: string;
  profiles: {
    username: string;
  } | null;
  votes: [{ count: number }];
  comments: [{ count: number }];
};

type PostCardProps = {
  post: Post;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const router = useRouter();

  const [voteCount, setVoteCount] = useState(post.votes[0]?.count ?? 0);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [userVoteId, setUserVoteId] = useState<number | null>(null);
  const commentCount = post.comments[0]?.count ?? 0;
  const hasComments = commentCount > 0;

  useEffect(() => {
    const checkUserVote = async () => {
      if (!user) return;
      const { data } = await supabase.from('votes').select('id').eq('post_id', post.id).eq('user_id', user.id).single();
      if (data) {
        setUserHasVoted(true);
        setUserVoteId(data.id);
      }
    };
    checkUserVote();
  }, [user, post.id]);

  const handleVote = async () => {
    if (!user) { Alert.alert("Ação necessária", "Você precisa estar logado para votar."); return; }
    if (userHasVoted && userVoteId) {
      setUserHasVoted(false); setVoteCount(prev => prev - 1);
      const { error } = await supabase.from('votes').delete().match({ id: userVoteId });
      if (error) { setUserHasVoted(true); setVoteCount(prev => prev + 1); } else { setUserVoteId(null); }
    } else {
      setUserHasVoted(true); setVoteCount(prev => prev + 1);
      const { data, error } = await supabase.from('votes').insert({ post_id: post.id, user_id: user.id }).select('id').single();
      if (error) { setUserHasVoted(false); setVoteCount(prev => prev - 1); } else { setUserVoteId(data.id); }
    }
  };

  const handleReport = () => {
    if (!user) {
      Alert.alert("Ação necessária", "Você precisa estar logado para denunciar.");
      return;
    }
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

  return (
    <View style={styles.card}>
      <Link href={`/post/${post.id}`} asChild>
        <Pressable>
          <View style={styles.mainContent}>
            <Image
              source={post.image_url ? { uri: post.image_url } : require('../../assets/images/icon.png')}
              style={styles.logo}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>{post.name}</Text>
              <Text style={styles.author} numberOfLines={1}>por @{post.profiles?.username || 'Anônimo'}</Text>
            </View>
            <View style={[styles.tag, post.type === 'APP' ? styles.appTag : styles.softwareTag]}>
              <Ionicons name={post.type === 'APP' ? 'phone-portrait-outline' : 'desktop-outline'} size={14} color={Colors.white} />
              <Text style={styles.tagText}>{post.type}</Text>
            </View>
          </View>
          <Text style={styles.description} numberOfLines={3}>
            {post.description}
          </Text>
        </Pressable>
      </Link>
      <View style={styles.footer}>
        <View style={styles.statsContainer}>
          <TouchableOpacity style={[styles.stat, userHasVoted && { backgroundColor: Colors.buttonPrimaryBackground }]} onPress={handleVote}>
            <Ionicons name="arrow-up" size={14} color={userHasVoted ? Colors.black : Colors.textPrimary} />
            <Text style={userHasVoted ? styles.statTextHighlight : styles.statText}>{voteCount} votos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stat}
            onPress={() => router.push(`/post/${post.id}?scrollTo=comments`)}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={14} color={hasComments ? Colors.textAction : Colors.placeholder} />
            <Text style={[styles.statText, hasComments && { color: Colors.textAction }]}>{commentCount} comentários</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
          <Ionicons name="flag-outline" size={14} color={Colors.textDanger} />
          <Text style={styles.reportText}>Reportar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.componentBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.componentBorder,
    marginVertical: 8,
    padding: 16,
  },

  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  logo: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: Colors.inputBackground,
  },

  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  author: {
    color: Colors.placeholder,
    fontSize: 14,
  },

  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
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
    fontSize: 12,
    marginLeft: 5,
  },

  description: {
    color: Colors.white,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.inputBorder,
    paddingTop: 12,
  },

  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: Colors.inputBackground,
  },
  statText: {
    color: Colors.placeholder,
    marginLeft: 6,
    fontWeight: '600',
  },
  statTextHighlight: {
    color: Colors.black,
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
  },
  reportText: {
    color: Colors.textDanger,
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 12,
  },
});


export default PostCard;