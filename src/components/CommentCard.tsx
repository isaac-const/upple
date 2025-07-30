import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Definimos a estrutura de dados de um comentário
export type Comment = {
  id: number;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
};

type CommentCardProps = {
  comment: Comment;
};

// Função para formatar a data
const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " anos atrás";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " meses atrás";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " dias atrás";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " horas atrás";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutos atrás";
  return Math.floor(seconds) + " segundos atrás";
};

const CommentCard = ({ comment }: CommentCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {comment.profiles?.username?.[0].toUpperCase() || '?'}
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.username}>{comment.profiles?.username || 'Anônimo'}</Text>
          <Text style={styles.timestamp}>{timeAgo(comment.created_at)}</Text>
        </View>
      </View>
      <Text style={styles.content}>{comment.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.componentBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerText: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  username: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  timestamp: {
    color: Colors.placeholder,
    fontSize: 12,
  },
  content: {
    color: Colors.white,
    fontSize: 15,
  },
});

export default CommentCard;