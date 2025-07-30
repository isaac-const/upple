import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, FlatList, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import PostCard, { Post } from '../../components/PostCard';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`id, name, description, type, image_url, profiles ( username ), votes ( count ), comments ( count )`)
        .or(`name.ilike.%${query.trim()}%,description.ilike.%${query.trim()}%`);
      if (error) throw error;
      setResults(data as Post[]);
    } catch (error: any) {
      console.error("Erro na busca:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={Colors.textPrimary} style={{ marginTop: 50 }} />;
    }
    if (!hasSearched) {
      return <View style={styles.placeholderContainer}><Text style={styles.placeholderText}>Toque na barra de pesquisa acima para PESQUISAR</Text></View>;
    }
    if (results.length === 0) {
      return <View style={styles.placeholderContainer}><Text style={styles.placeholderText}>Nenhum resultado encontrado para "{query}"</Text></View>;
    }
    return (
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Pesquisar Posts..."
          placeholderTextColor={Colors.placeholder}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>
      <Text style={styles.resultsLabel}>Resultados:</Text>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    color: Colors.white,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: Colors.buttonPrimaryBackground,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  resultsLabel: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: Colors.placeholder,
    fontSize: 16,
    textAlign: 'center',
  },
});


export default SearchScreen;