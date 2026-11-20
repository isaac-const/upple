import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Pressable, Image } from 'react-native';
import { useFocusEffect, useRouter, Link } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/Colors';
import PostCard, { Post } from '../../components/PostCard';
import { Ionicons } from '@expo/vector-icons';

type RankingItem = {
  id: string;
  name: string;
  vote_count: number;
  image_url?: string | null; 
};

export default function HomeScreen() {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const { data: rankingData, error: rankingError } = await supabase
        .from('weekly_ranking')
        .select('id, name, vote_count, image_url') 
        .limit(3);

      if (rankingError) throw rankingError;
      setRanking(rankingData || []);

      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id, name, description, type, image_url, 
          profiles ( username ),
          votes ( count ),
          comments ( count )
        `)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      setPosts(postsData as Post[]);

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.textPrimary} />
      </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 130 }} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.textPrimary} />}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ranking semanal</Text>
          <View style={styles.rankingContainer}>
            {ranking.map((item, index) => (
              <Link key={item.id} href={`/post/${item.id}`} asChild>
                <Pressable style={{ flex: 1 }}>
                  
                  <View style={[styles.rankingCard, { paddingTop: 14 + (index === 0 ? 14 : index === 1 ? 6 : 0), paddingBottom: 14 + (index === 0 ? 14 : 0) }]}>
                    <Text style={styles.rankingPlace}>{index + 1}º LUGAR</Text>
                    <Image 
                      source={item.image_url ? { uri: item.image_url } : require('../../../assets/images/icon.png')}
                      style={styles.rankingImage}
                    />
                    <Text style={styles.rankingName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.rankingVotes}>{item.vote_count} votos</Text>
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recentes</Text>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/create-post')}
      >
        <Ionicons name="add" size={32} color={Colors.black} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  container: { flex: 1 },
  section: { paddingHorizontal: 16, paddingTop: 22 },
  sectionTitle: { color: Colors.placeholder, fontSize: 12, fontWeight: '800', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 2 },
  rankingContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, alignItems: 'flex-end' },
  rankingCard: { backgroundColor: Colors.componentBackground, paddingVertical: 14, paddingHorizontal: 10, borderRadius: 22, borderWidth: 1, borderColor: Colors.componentBorder, alignItems: 'center' },
  rankingPlace: { color: Colors.accent, fontSize: 12, fontWeight: '800', marginBottom: 10, letterSpacing: 1 },
  rankingImage: { width: 58, height: 58, borderRadius: 18, marginBottom: 8 },
  rankingName: { color: Colors.white, fontSize: 14, fontWeight: '700', marginTop: 2 },
  rankingVotes: { color: Colors.placeholder, fontSize: 12, marginTop: 2 },
  fab: { position: 'absolute', width: 62, height: 62, borderRadius: 22, backgroundColor: Colors.buttonPrimaryBackground, justifyContent: 'center', alignItems: 'center', bottom: 104, right: 20, zIndex: 20, shadowColor: '#b8f27a', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 10 },
});
