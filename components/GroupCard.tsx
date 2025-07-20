import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Group } from '@/types';
import Avatar from './Avatar';
import colors from '@/constants/colors';
import { Users } from 'lucide-react-native';

interface GroupCardProps {
  group: Group;
  onPress: () => void;
}

export default function GroupCard({ group, onPress }: GroupCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Users size={20} color={colors.primary} />
        </View>
        <Text style={styles.name}>{group.name}</Text>
      </View>
      
      <View style={styles.membersContainer}>
        <Text style={styles.membersLabel}>
          {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
        </Text>
        <View style={styles.avatarsContainer}>
          {group.members.slice(0, 3).map((member, index) => (
            <View key={member.id} style={[styles.avatarWrapper, { zIndex: 3 - index, marginLeft: index > 0 ? -10 : 0 }]}>
              <Avatar 
                name={member.name} 
                userId={member.id} 
                size={28} 
              />
            </View>
          ))}
          {group.members.length > 3 && (
            <View style={[styles.avatarWrapper, styles.moreAvatars, { marginLeft: -10, zIndex: 0 }]}>
              <Text style={styles.moreAvatarsText}>+{group.members.length - 3}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.inviteCode}>Invite code: {group.inviteCode}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    flex: 1,
  },
  membersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  membersLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: colors.card,
    borderRadius: 14,
  },
  moreAvatars: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreAvatarsText: {
    fontSize: 10,
    color: colors.text,
    fontWeight: '600' as const,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: 12,
  },
  inviteCode: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500' as const,
  },
});