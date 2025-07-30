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
        contentContainerStyle={{ paddingBottom: 100 }} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.textPrimary} />}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RANKING SEMANAL</Text>
          <View style={styles.rankingContainer}>
            {ranking.map((item, index) => (
              <Link key={item.id} href={`/post/${item.id}`} asChild>
                <Pressable style={{ flex: 1 }}>
                  
                  <View style={styles.rankingCard}>
                    <Text style={styles.rankingPlace}>{index + 1}° Lugar</Text>
                    <Image 
                      source={item.image_url ? { uri: item.image_url } : require('../../../assets/images/icon.png')}
                      style={styles.rankingImage}
                    />
                    <Text style={styles.rankingName} numberOfLines={1}>{item.name}</Text>
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECENTES</Text>
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
  fullContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  rankingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  rankingCard: {
    backgroundColor: Colors.componentBackground,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.componentBorder,
    alignItems: 'center',
    height: 130, 
  },
  rankingPlace: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6, 
  },
  rankingImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 2,
  },
  rankingName: {
    color: Colors.white,
    fontSize: 14,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.buttonPrimaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 30,
    right: 20,
    zIndex: 20,
  },
});