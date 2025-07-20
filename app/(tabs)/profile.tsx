import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAppState } from '@/hooks/useAppState';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Edit2, LogOut, Users } from 'lucide-react-native';
import { formatRelativeTime } from '@/utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const { user, userGroups } = useAppState();
  const router = useRouter();

  const navigateToEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? This will clear all your data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Avatar name={user.name} userId={user.id} size={80} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{user.name}</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={navigateToEditProfile}
          >
            <Edit2 size={16} color={colors.primary} />
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Card style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>Current Status</Text>
          <Text style={styles.statusTime}>
            Updated {formatRelativeTime(user.lastUpdated)}
          </Text>
        </View>
        <View style={styles.statusContent}>
          <Text style={styles.statusText}>{user.status}</Text>
        </View>
        <Button
          title="Update Status"
          onPress={navigateToEditProfile}
          style={styles.updateButton}
          variant="outline"
        />
      </Card>

      <Card style={styles.groupsCard}>
        <View style={styles.groupsHeader}>
          <Text style={styles.groupsTitle}>My Groups</Text>
          <Users size={18} color={colors.primary} />
        </View>
        <Text style={styles.groupsCount}>
          You're in {userGroups.length} {userGroups.length === 1 ? 'group' : 'groups'}
        </Text>
        {userGroups.length > 0 && (
          <View style={styles.groupsList}>
            {userGroups.map(group => (
              <View key={group.id} style={styles.groupItem}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupMembers}>
                  {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      <Button
        title="Logout"
        onPress={handleLogout}
        variant="outline"
        style={styles.logoutButton}
        textStyle={styles.logoutText}
        icon={<LogOut size={18} color={colors.error} style={{ marginRight: 8 }} />}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  nameContainer: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500' as const,
    marginLeft: 4,
  },
  statusCard: {
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  statusTime: {
    fontSize: 12,
    color: colors.textLight,
  },
  statusContent: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  updateButton: {
    alignSelf: 'flex-start',
  },
  groupsCard: {
    marginBottom: 24,
  },
  groupsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  groupsCount: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  groupsList: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: 12,
  },
  groupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  groupName: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500' as const,
  },
  groupMembers: {
    fontSize: 13,
    color: colors.textLight,
  },
  logoutButton: {
    borderColor: colors.error,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: colors.error,
  },
});