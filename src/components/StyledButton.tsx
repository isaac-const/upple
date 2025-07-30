import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';

interface StyledButtonProps {
  title: string;
  onPress?: () => void; // <-- MUDANÇA: 'onPress' agora é opcional
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: object;
}

const StyledButton = ({ title, onPress, loading, style, textStyle }: StyledButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={Colors.black} />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.buttonPrimaryBackground,
    borderColor: Colors.buttonPrimaryBorder,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  buttonText: {
    color: Colors.black,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StyledButton;