import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Image, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { Colors } from '../constants/Colors';
import StyledInput from '../components/StyledInput';
import StyledButton from '../components/StyledButton';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { Post } from '../components/PostCard';

type PostType = 'APP' | 'SOFTWARE';

const EditPostScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { post: postString } = useLocalSearchParams<{ post: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [officialLink, setOfficialLink] = useState('');
  const [type, setType] = useState<PostType>('SOFTWARE');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (postString) {
      const parsedPost = JSON.parse(postString);
      setPost(parsedPost);
      setName(parsedPost.name || '');
      setDescription(parsedPost.description || '');
      setGithubLink(parsedPost.github_link || '');
      setOfficialLink(parsedPost.official_link || '');
      setType(parsedPost.type || 'SOFTWARE');
      setExistingImageUrl(parsedPost.image_url || null);
    }
  }, [postString]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleUpdate = async () => {
    if (!post) return;
    setLoading(true);
    let publicImageUrl = existingImageUrl;

    if (image?.base64 && user) {
      const fileExt = image.uri.split('.').pop()?.toLowerCase() ?? 'png';
      const filePath = `public/${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, decode(image.base64), { contentType: `image/${fileExt}` });
      if (uploadError) {
        Alert.alert('Erro no Upload', 'Não foi possível enviar a nova imagem.');
        setLoading(false);
        return;
      }
      publicImageUrl = supabase.storage.from('images').getPublicUrl(filePath).data.publicUrl;
    }
    
    const { error } = await supabase.from('posts')
      .update({
        name,
        description,
        github_link: githubLink,
        official_link: officialLink,
        type,
        image_url: publicImageUrl,
      })
      .eq('id', post.id);

    setLoading(false);
    if (error) {
      Alert.alert("Erro ao atualizar", error.message);
    } else {
      Alert.alert("Sucesso!", "Seu post foi atualizado.");
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Nome do conteúdo</Text>
          <StyledInput value={name} onChangeText={setName} />
          
          <Text style={styles.label}>Tipo de conteúdo</Text>
          <View style={styles.segmentedControl}>
            <TouchableOpacity style={[styles.segmentButton, type === 'SOFTWARE' && styles.segmentButtonActive]} onPress={() => setType('SOFTWARE')}>
              <Text style={styles.segmentText}>Software</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.segmentButton, type === 'APP' && styles.segmentButtonActive]} onPress={() => setType('APP')}>
              <Text style={styles.segmentText}>App</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Descreva o projeto, suas funcionalidades..."
            placeholderTextColor={Colors.placeholder}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>GitHub (opcional)</Text>
          <StyledInput value={githubLink} onChangeText={setGithubLink} autoCapitalize="none" />
          
          <Text style={styles.label}>Link oficial da página (opcional)</Text>
          <StyledInput value={officialLink} onChangeText={setOfficialLink} autoCapitalize="none" />
          
          <Text style={styles.label}>Logo do Projeto (opcional)</Text>
          <View style={styles.imagePreviewContainer}>
            <Image 
              source={{ uri: image?.uri || existingImageUrl || undefined }} 
              style={styles.imagePreview} 
            />
            <TouchableOpacity onPress={pickImage} style={styles.editImageButton}>
              <Text style={styles.editImageText}>Trocar logo</Text>
            </TouchableOpacity>
          </View>
          
          <StyledButton title="Salvar Alterações" onPress={handleUpdate} loading={loading} style={{ marginTop: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  descriptionInput: {
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: Colors.white,
    fontSize: 16,
    width: '100%',
    marginVertical: 10,
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  editImageText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: Colors.inputBackground,
  },
  imagePreviewContainer: {
    marginTop: 10,
    position: 'relative',
    alignSelf: 'flex-start',
  },
  label: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  segmentedControl: {
    flexDirection: 'row',
    width: '100%',
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
  },
  segmentButtonActive: {
    backgroundColor: Colors.componentBorder,
  },
  segmentText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditPostScreen;