import React, { useEffect } from 'react';
import { useRouter, useSegments, Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../lib/AuthContext';
import { Colors } from '../constants/Colors';

const RootLayoutNav = () => {
  const { session, loading, role } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inApp = segments[0] === '(tabs)' || segments[0] === '(admin)';

    if (session) {
      if (!inApp) {
        if (role === 'admin') {
          router.replace('/(admin)');
        } else {
          router.replace('/(tabs)');
        }
      }
    } else {
      router.replace('/(auth)');
    }
   
  }, [session, loading, role]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} /> 
      <Stack.Screen name="create-post" options={{ presentation: 'modal', title: 'Criar Post', headerStyle: { backgroundColor: Colors.background }, headerTitleStyle: { color: Colors.textPrimary }, headerTintColor: Colors.textAction, headerTitleAlign: 'center' }} />
      <Stack.Screen name="edit-post" options={{ presentation: 'modal', title: 'Editar Post', headerStyle: { backgroundColor: Colors.background }, headerTitleStyle: { color: Colors.textPrimary }, headerTintColor: Colors.textAction, headerTitleAlign: 'center' }} />
      <Stack.Screen name="post/[id]" options={{ title: '', headerStyle: { backgroundColor: Colors.background }, headerTitleStyle: { color: Colors.textPrimary }, headerTintColor: Colors.textAction }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}