import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { Colors } from '../constants/Colors';
import StyledInput from '../components/StyledInput';
import StyledButton from '../components/StyledButton';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

type PostType = 'APP' | 'SOFTWARE';

const CreatePostScreen = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [officialLink, setOfficialLink] = useState('');
  const [type, setType] = useState<PostType>('SOFTWARE');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar sua galeria.');
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

  const uploadImage = async () => {
    if (!image?.base64 || !user) {
      return null;
    }
    const fileExt = image.uri.split('.').pop()?.toLowerCase() ?? 'png';
    const filePath = `public/${user.id}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, decode(image.base64), { contentType: `image/${fileExt}` });
    if (uploadError) {
      Alert.alert('Erro no Upload', `Não foi possível enviar a imagem: ${uploadError.message}`);
      return null;
    }
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handlePost = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert("Campos obrigatórios", "O nome e a descrição são obrigatórios.");
      return;
    }
    if (!user) {
      Alert.alert("Erro de Autenticação", "Você precisa estar logado para criar um post.");
      return;
    }
    setLoading(true);
    let publicImageUrl: string | null = null;
    if (image) {
      publicImageUrl = await uploadImage();
    }
    const { error } = await supabase.from('posts').insert({ name, description, github_link: githubLink || null, official_link: officialLink || null, type, user_id: user.id, image_url: publicImageUrl });
    setLoading(false);
    if (error) {
      Alert.alert("Erro ao criar post", error.message);
    } else {
      Alert.alert("Sucesso!", "Seu conteúdo foi postado.");
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Nome do conteúdo</Text>
          <StyledInput placeholder="Nome do app, software, etc..." value={name} onChangeText={setName} />
          
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
          <StyledInput placeholder="https://github.com/usuario/repositorio" value={githubLink} onChangeText={setGithubLink} autoCapitalize="none" />
          
          <Text style={styles.label}>Link oficial da página (opcional)</Text>
          <StyledInput placeholder="https://meuprojeto.com" value={officialLink} onChangeText={setOfficialLink} autoCapitalize="none" />
          
          <Text style={styles.label}>Logo do Projeto (opcional)</Text>
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
              <TouchableOpacity onPress={() => setImage(null)} style={styles.removeImageButton}>
                <Text style={styles.removeImageText}>Trocar logo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Text style={styles.imagePickerButtonText}>Selecionar uma Logo</Text>
            </TouchableOpacity>
          )}
          <StyledButton title="Postar Conteúdo" onPress={handlePost} loading={loading} style={{ marginTop: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
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
  imagePickerButton: { 
    backgroundColor: Colors.inputBackground, 
    borderColor: Colors.inputBorder, 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 15, 
    alignItems: 'center', 
    marginTop: 8 
  },
  imagePickerButtonText: { 
    color: Colors.textAction, 
    fontSize: 16 
  },
  imagePreview: { 
    width: 100, 
    height: 100, 
    borderRadius: 12, 
    backgroundColor: Colors.inputBackground 
  },
  imagePreviewContainer: { 
    marginTop: 10, 
    alignItems: 'center', 
    position: 'relative', 
    alignSelf: 'flex-start' 
  },
  label: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  removeImageButton: { 
    position: 'absolute', 
    top: -5, 
    right: -5, 
    backgroundColor: Colors.textDanger, 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  removeImageText: { 
    color: Colors.white, 
    fontSize: 14, 
    fontWeight: 'bold', 
    lineHeight: 16 
  },
  scrollContainer: { 
    paddingHorizontal: 20, 
    paddingBottom: 40 
  },
  segmentedControl: { 
    flexDirection: 'row', 
    width: '100%', 
    borderColor: Colors.inputBorder, 
    borderWidth: 1, 
    borderRadius: 8, 
    overflow: 'hidden' 
  },
  segmentButton: { 
    flex: 1, 
    padding: 12, 
    alignItems: 'center', 
    backgroundColor: Colors.inputBackground 
  },
  segmentButtonActive: { 
    backgroundColor: Colors.componentBorder 
  },
  segmentText: { 
    color: Colors.white, 
    fontSize: 16, 
    fontWeight: '600' 
  },
});

export default CreatePostScreen;