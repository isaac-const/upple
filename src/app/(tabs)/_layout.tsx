import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { View, Image, Text } from 'react-native'; // Importe os componentes necessários

// Componente para o cabeçalho personalizado
const CustomHeaderTitle = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image 
      source={require('../../../assets/images/logo.png')} 
      style={{ width: 34, height: 34, marginRight: 10, borderRadius: 10 }}
    />
    <Text style={{ color: Colors.textPrimary, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
      Upple
    </Text>
  </View>
);

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background, shadowColor: 'transparent', borderBottomWidth: 0 },
        headerTitleStyle: { color: Colors.textPrimary },
        headerTitleAlign: 'left',
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.placeholder,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: {
          position: 'absolute', left: 16, right: 16, bottom: 16, height: 68, paddingBottom: 8, paddingTop: 8,
          borderRadius: 26, backgroundColor: Colors.componentBackground, borderTopWidth: 0, borderWidth: 1, borderColor: Colors.componentBorder,
          shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.5, shadowRadius: 24, elevation: 12,
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