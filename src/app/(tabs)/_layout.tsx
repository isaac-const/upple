import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { View, Image, Text } from 'react-native'; // Importe os componentes necessários

// Componente para o cabeçalho personalizado
const CustomHeaderTitle = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image 
      source={require('../../../assets/images/logo.png')} 
      style={{ width: 28, height: 28, marginRight: 8 }}
    />
    <Text style={{ color: Colors.textPrimary, fontSize: 22, fontWeight: 'bold' }}>
      Upple
    </Text>
  </View>
);

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
          shadowColor: 'transparent', // Remove a linha de sombra do header no iOS
        },
        headerTitleStyle: {
          color: Colors.textPrimary,
        },
        headerTitleAlign: 'center',
        tabBarActiveTintColor: Colors.textPrimary,
        tabBarInactiveTintColor: Colors.placeholder,
        tabBarStyle: {
          backgroundColor: Colors.componentBackground,
          borderTopColor: Colors.componentBorder,
          height: 80,
          paddingBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          // AQUI ESTÁ A MUDANÇA
          headerTitle: () => <CustomHeaderTitle />,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
          tabBarLabel: 'Início',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          // AQUI ESTÁ A MUDANÇA
          headerTitle: () => <CustomHeaderTitle />,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={size} color={color} />
          ),
          tabBarLabel: 'Pesquisar',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Meu Perfil', // Mantemos o título simples aqui
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
          ),
          tabBarLabel: 'Perfil',
        }}
      />
    </Tabs>
  );
}