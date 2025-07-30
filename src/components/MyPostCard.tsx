import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Post } from './PostCard';

type MyPostCardProps = {
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
};

const MyPostCard = ({ post, onEdit, onDelete }: MyPostCardProps) => {
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
              <Text style={styles.author} numberOfLines={1}>
                {new Date(post.created_at).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <View style={[styles.tag, post.type === 'APP' ? styles.appTag : styles.softwareTag]}>
              <Ionicons name={post.type === 'APP' ? 'phone-portrait-outline' : 'desktop-outline'} size={14} color={Colors.white} />
              <Text style={styles.tagText}>{post.type}</Text>
            </View>
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {post.description}
          </Text>
        </Pressable>
      </Link>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Ionicons name="pencil-outline" size={16} color={Colors.textAction} />
            <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Ionicons name="trash-outline" size={16} color={Colors.textDanger} />
            <Text style={styles.deleteText}>Excluir</Text>
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
  appTag: { backgroundColor: '#3A5944' },
  softwareTag: { backgroundColor: '#294652' },
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
    justifyContent: 'flex-end', 
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.inputBorder,
    paddingTop: 12,
    gap: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.inputBackground,
  },
  editText: {
    color: Colors.textAction,
    marginLeft: 6,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.inputBackground,
  },
  deleteText: {
    color: Colors.textDanger,
    marginLeft: 6,
    fontWeight: '600',
  },
});

export default MyPostCard;