import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Notification } from '@/types';
import { formatRelativeTime } from '@/utils/helpers';
import colors from '@/constants/colors';
import { Bell } from 'lucide-react-native';

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
}

export default function NotificationItem({ notification, onPress }: NotificationItemProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        !notification.read && styles.unread
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Bell size={20} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>{notification.message}</Text>
        <View style={styles.footer}>
          <Text style={styles.groupName}>{notification.groupName}</Text>
          <Text style={styles.time}>{formatRelativeTime(notification.timestamp)}</Text>
        </View>
      </View>
      {!notification.read && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: 'center',
  },
  unread: {
    backgroundColor: `${colors.primary}10`,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500' as const,
  },
  time: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
});