import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Text } from 'react-native';
import { Colors } from '../../constants/Colors';

const TermsOfUseScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.lastUpdated}>Última atualização: 29 de Julho de 2025</Text>

        <Text style={styles.paragraph}>
          Bem-vindo(a) ao Upple! Estes Termos de Uso ("Termos") governam o seu acesso e uso do nosso aplicativo móvel e serviços ("Serviço"). Ao acessar ou usar o Serviço, você concorda em cumprir estes Termos.
        </Text>

        <Text style={styles.heading}>1. Contas de Usuário</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Elegibilidade:</Text> Você deve ter pelo menos 13 anos de idade para criar uma conta e usar o Upple.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Segurança da Conta:</Text> Você é responsável por manter a confidencialidade da sua senha e por todas as atividades que ocorrem em sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado da sua conta.
        </Text>

        <Text style={styles.heading}>2. Conteúdo Gerado pelo Usuário</Text>
        <Text style={styles.paragraph}>
          O Upple é uma plataforma baseada na comunidade. Todo o conteúdo, incluindo posts sobre projetos, comentários, links e imagens ("Conteúdo do Usuário") é de responsabilidade da pessoa que o publicou.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Licença de Uso:</Text> Ao postar Conteúdo do Usuário no Upple, você nos concede uma licença mundial, não exclusiva, livre de royalties e transferível para usar, exibir, reproduzir e distribuir seu conteúdo em conexão com o Serviço.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Conteúdo Proibido:</Text> Você concorda em não postar conteúdo que seja ilegal, enganoso, discriminatório, fraudulento, que infrinja direitos de terceiros, contenha spam ou promova discurso de ódio.
        </Text>

        <Text style={styles.heading}>3. Conduta na Plataforma</Text>
        <Text style={styles.paragraph}>
          Esperamos que todos os usuários interajam de forma respeitosa. Ações como assédio, spam nos comentários ou manipulação do sistema de votos são estritamente proibidas e podem levar à suspensão da sua conta.
        </Text>

        <Text style={styles.heading}>4. Moderação e Nossos Direitos</Text>
        <Text style={styles.paragraph}>
          Reservamo-nos o direito de remover qualquer conteúdo e suspender ou encerrar sua conta a nosso critério, especialmente por violações destes Termos. A funcionalidade de "Reportar" existe para que a comunidade nos ajude a identificar conteúdo que precise de revisão.
        </Text>

        <Text style={styles.heading}>5. Isenção de Garantias</Text>
        <Text style={styles.paragraph}>
          O Serviço é fornecido "no estado em que se encontra", sem garantias de qualquer tipo. Não garantimos que o Serviço será sempre seguro, protegido, livre de erros ou que funcionará sem interrupções.
        </Text>

        <Text style={styles.heading}>6. Alterações nos Termos</Text>
        <Text style={styles.paragraph}>
          Podemos modificar estes Termos de tempos em tempos. O uso continuado do Serviço após a data de vigência das alterações constituirá sua aceitação dos novos Termos.
        </Text>

        <Text style={styles.heading}>7. Contato</Text>
        <Text style={styles.paragraph}>
          Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em: isaaccs.code@gmail.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: Colors.placeholder,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: Colors.white,
    lineHeight: 24,
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default TermsOfUseScreen;