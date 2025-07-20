import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppState } from '@/hooks/useAppState';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import { UserPlus } from 'lucide-react-native';

export default function JoinGroupScreen() {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { joinGroup } = useAppState();
  const router = useRouter();

  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Error', 'Invite code cannot be empty');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await joinGroup(inviteCode.trim().toUpperCase());
      if (success) {
        router.push('/groups');
      }
    } catch (error) {
      console.error('Error joining group:', error);
      Alert.alert('Error', 'Failed to join group');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <UserPlus size={32} color={colors.primary} />
          </View>
          
          <Text style={styles.title}>Join a Group</Text>
          <Text style={styles.subtitle}>
            Enter an invite code to join an existing group
          </Text>
          
          <View style={styles.form}>
            <Text style={styles.label}>Invite Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-character code"
              value={inviteCode}
              onChangeText={(text) => setInviteCode(text.toUpperCase())}
              autoCapitalize="characters"
              maxLength={6}
            />
            
            <Text style={styles.infoText}>
              Ask your friend to share their group's invite code with you.
              Groups can have a maximum of 4 members.
            </Text>
            
            <Button
              title="Join Group"
              onPress={handleJoinGroup}
              disabled={inviteCode.length !== 6 || isLoading}
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
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
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
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 2,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    width: '100%',
  },
});