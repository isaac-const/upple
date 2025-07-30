import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />

      <Stack.Screen
        name="terms"
        options={{
          headerShown: true,
          title: 'Termos de Uso',
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.textPrimary },
          headerTintColor: Colors.textAction, 
        }}
      />
    </Stack>
  );
}