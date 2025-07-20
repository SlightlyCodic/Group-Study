import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppState } from '@/hooks/useAppState';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import { Users } from 'lucide-react-native';

export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createGroup } = useAppState();
  const router = useRouter();

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Group name cannot be empty');
      return;
    }
    
    setIsLoading(true);
    try {
      const newGroup = await createGroup(groupName.trim());
      if (newGroup) {
        router.push(`/group/${newGroup.id}`);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', 'Failed to create group');
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
            <Users size={32} color={colors.primary} />
          </View>
          
          <Text style={styles.title}>Create a New Group</Text>
          <Text style={styles.subtitle}>
            Create a group to share status updates with friends
          </Text>
          
          <View style={styles.form}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter group name"
              value={groupName}
              onChangeText={setGroupName}
              maxLength={30}
            />
            
            <Text style={styles.infoText}>
              After creating a group, you'll get a unique invite code to share with friends.
              Up to 4 people can join a group.
            </Text>
            
            <Button
              title="Create Group"
              onPress={handleCreateGroup}
              disabled={!groupName.trim() || isLoading}
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