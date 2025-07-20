import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { getInitials, getAvatarColor } from '@/utils/helpers';

interface AvatarProps {
  name: string;
  userId: string;
  size?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Avatar({ name, userId, size = 40, style, textStyle }: AvatarProps) {
  const backgroundColor = getAvatarColor(userId);
  const initials = getInitials(name);
  
  return (
    <View 
      style={[
        styles.container, 
        { width: size, height: size, borderRadius: size / 2, backgroundColor },
        style
      ]}
    >
      <Text 
        style={[
          styles.text, 
          { fontSize: size * 0.4 },
          textStyle
        ]}
      >
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '600' as const,
  },
});