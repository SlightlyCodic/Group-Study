import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Share, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useAppState } from '@/hooks/useAppState';
import StatusCard from '@/components/StatusCard';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import colors from '@/constants/colors';
import { Share2, LogOut } from 'lucide-react-native';

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { groups, leaveGroup, user } = useAppState();
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  const group = groups.find(g => g.id === id);

  if (!group || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Group not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.backButton}
          variant="outline"
        />
      </View>
    );
  }

  const handleShareInvite = async () => {
    try {
      await Share.share({
        message: `Join my group "${group.name}" in Group Status app! Use invite code: ${group.inviteCode}`,
      });
    } catch (error) {
      console.error('Error sharing invite:', error);
    }
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      'Leave Group',
      'Are you sure you want to leave this group?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            setIsLeaving(true);
            try {
              await leaveGroup(group.id);
              router.replace('/groups');
            } catch (error) {
              console.error('Error leaving group:', error);
              setIsLeaving(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: group.name,
          headerRight: () => (
            <TouchableOpacity onPress={handleShareInvite} style={styles.shareButton}>
              <Share2 size={20} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <FlatList
        data={group.members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StatusCard 
            user={item} 
            isCurrentUser={item.id === user.id}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{group.name}</Text>
              <View style={styles.membersInfo}>
                <Text style={styles.membersCount}>
                  {group.members.length}/4 members
                </Text>
                <Text style={styles.inviteCode}>
                  Invite Code: {group.inviteCode}
                </Text>
              </View>
            </View>
            
            <View style={styles.membersContainer}>
              <Text style={styles.membersTitle}>Members</Text>
              <View style={styles.membersList}>
                {group.members.map(member => (
                  <View key={member.id} style={styles.memberItem}>
                    <Avatar name={member.name} userId={member.id} size={32} />
                    <Text style={styles.memberName}>
                      {member.name} {member.id === user.id ? '(You)' : ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.divider} />
            <Text style={styles.statusesTitle}>Status Updates</Text>
          </View>
        }
        ListFooterComponent={
          <Button
            title="Leave Group"
            onPress={handleLeaveGroup}
            variant="outline"
            style={styles.leaveButton}
            textStyle={styles.leaveButtonText}
            disabled={isLeaving}
            loading={isLeaving}
            icon={<LogOut size={18} color={colors.error} style={{ marginRight: 8 }} />}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  groupInfo: {
    marginBottom: 24,
  },
  groupName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  membersInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membersCount: {
    fontSize: 14,
    color: colors.textLight,
  },
  inviteCode: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500' as const,
  },
  membersContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  membersList: {
    gap: 12,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray300,
    marginBottom: 16,
  },
  statusesTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  leaveButton: {
    marginTop: 24,
    marginBottom: 40,
    borderColor: colors.error,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaveButtonText: {
    color: colors.error,
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'center',
  },
  shareButton: {
    padding: 8,
  },
});