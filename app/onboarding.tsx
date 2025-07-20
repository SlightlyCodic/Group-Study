import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppState } from '@/hooks/useAppState';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import { Users } from 'lucide-react-native';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { completeOnboarding } = useAppState();
  const router = useRouter();

  const handleContinue = async () => {
    if (!name.trim()) return;
    
    setIsLoading(true);
    try {
      await completeOnboarding(name.trim());
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Users size={40} color={colors.primary} />
          </View>
          
          <Text style={styles.title}>Welcome to Group Status</Text>
          <Text style={styles.subtitle}>
            Connect with friends and share your status updates in small, private groups.
          </Text>
          
          <View style={styles.form}>
            <Text style={styles.label}>What's your name?</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={30}
            />
            
            <Button
              title="Continue"
              onPress={handleContinue}
              disabled={!name.trim() || isLoading}
              loading={isLoading}
              style={styles.button}
              size="large"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
});