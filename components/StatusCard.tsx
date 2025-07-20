import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '@/types';
import Avatar from './Avatar';
import { formatRelativeTime } from '@/utils/helpers';
import colors from '@/constants/colors';

interface StatusCardProps {
  user: User;
  isCurrentUser?: boolean;
  onPress?: () => void;
}

export default function StatusCard({ user, isCurrentUser = false, onPress }: StatusCardProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isCurrentUser && styles.currentUserContainer
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <Avatar name={user.name} userId={user.id} size={40} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.time}>
            {isCurrentUser ? 'You · ' : ''}{formatRelativeTime(user.lastUpdated)}
          </Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.status}>{user.status}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: colors.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentUserContainer: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  time: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  statusContainer: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    padding: 12,
  },
  status: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
});