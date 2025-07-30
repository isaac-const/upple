import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native'; // Importe o Image
import { Link } from 'expo-router';
import { Colors } from '../../constants/Colors';
import StyledButton from '../../components/StyledButton';

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../../assets/images/logo.png')} 
          style={styles.logoImage} 
        />
        <Text style={styles.logoText}>Upple</Text>
        <Text style={styles.tagline}>
          Explore, avalie e discuta projetos open-source.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/login" asChild>
          <StyledButton title="Entre em sua Conta" />
        </Link>
        <Link href="/register" asChild>
          <StyledButton
            title="Crie uma Nova Conta"
            style={{ 
                backgroundColor: 'transparent', 
                borderColor: Colors.textPrimary 
            }}
            textStyle={{ color: Colors.textPrimary }}
          />
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  tagline: {
    fontSize: 18,
    color: Colors.placeholder,
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 20,
  },
});