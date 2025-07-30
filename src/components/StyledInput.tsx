import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '../constants/Colors';

const StyledInput = (props: TextInputProps) => {
  return (
    <TextInput
      placeholderTextColor={Colors.placeholder}
      style={[styles.input, props.style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: Colors.white, 
    fontSize: 16,
    width: '100%',
    marginVertical: 10,
  },
});

export default StyledInput;