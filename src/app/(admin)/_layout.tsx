import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTitleStyle: { color: Colors.textPrimary },
        headerTintColor: Colors.textAction,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Dashboard" }}/>
      <Stack.Screen name="users" options={{ title: "Gerenciar Usuários" }}/>
      <Stack.Screen name="posts" options={{ title: "Gerenciar Posts" }}/>
      <Stack.Screen name="reports" options={{ title: "Denúncias" }}/>
    </Stack>
  );
}