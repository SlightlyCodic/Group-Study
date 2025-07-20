import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppState } from '@/hooks/useAppState';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import { formatRelativeTime } from '@/utils/helpers';

export default function EditProfileScreen() {
  const { user, updateStatus } = useAppState();
  const [status, setStatus] = useState(user?.status || '');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdateStatus = async () => {
    if (!status.trim()) {
      Alert.alert('Error', 'Status cannot be empty');
      return;
    }
    
    setIsLoading(true);
    try {
      await updateStatus(status.trim());
      router.back();
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Update Your Status</Text>
            <Text style={styles.subtitle}>
              Let your friends know what's going on with you
            </Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.currentStatusContainer}>
              <Text style={styles.currentStatusLabel}>Current Status:</Text>
              <Text style={styles.currentStatus}>{user.status}</Text>
              <Text style={styles.lastUpdated}>
                Last updated {formatRelativeTime(user.lastUpdated)}
              </Text>
            </View>
            
            <Text style={styles.label}>New Status</Text>
            <TextInput
              style={styles.input}
              placeholder="What's on your mind?"
              value={status}
              onChangeText={setStatus}
              multiline
              maxLength={200}
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <Text style={styles.charCount}>
              {status.length}/200 characters
            </Text>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => router.back()}
                variant="outline"
                style={styles.cancelButton}
              />
              <Button
                title="Update"
                onPress={handleUpdateStatus}
                disabled={!status.trim() || isLoading || status === user.status}
                loading={isLoading}
                style={styles.updateButton}
              />
            </View>
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
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  currentStatusContainer: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  currentStatusLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textLight,
    marginBottom: 4,
  },
  currentStatus: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
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
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: colors.textLight,
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  updateButton: {
    flex: 1,
    marginLeft: 8,
  },
});