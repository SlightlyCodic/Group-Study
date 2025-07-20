import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Utility function to generate invite codes
export const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// User operations
export const userDb = {
  create: async (id, name) => {
    const now = new Date().toISOString();
    const status = "I'm new here!";
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        id,
        name,
        status,
        last_updated: now,
      })
      .select()
      .single();

    if (error) {
      // If user already exists, return existing user
      if (error.code === '23505') {
        return await userDb.getById(id);
      }
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      status: data.status,
      lastUpdated: data.last_updated,
    };
  },

  updateStatus: async (userId, status) => {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('users')
      .update({
        status,
        last_updated: now,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('User not found');
    }

    return {
      status: data.status,
      lastUpdated: data.last_updated,
    };
  },

  getById: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, status, last_updated')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      status: data.status,
      lastUpdated: data.last_updated,
    };
  },

  getByIds: async (userIds) => {
    if (userIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from('users')
      .select('id, name, status, last_updated')
      .in('id', userIds);

    if (error) {
      throw error;
    }

    return data.map(user => ({
      id: user.id,
      name: user.name,
      status: user.status,
      lastUpdated: user.last_updated,
    }));
  },
};

// Group operations
export const groupDb = {
  create: async (id, name, userId) => {
    const inviteCode = generateInviteCode();
    const now = new Date().toISOString();
    
    // Create group
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .insert({
        id,
        name,
        invite_code: inviteCode,
        created_at: now,
      })
      .select()
      .single();

    if (groupError) {
      throw groupError;
    }

    // Add creator as member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: id,
        user_id: userId,
        joined_at: now,
      });

    if (memberError) {
      throw memberError;
    }

    return {
      id: groupData.id,
      name: groupData.name,
      inviteCode: groupData.invite_code,
      createdAt: groupData.created_at,
    };
  },

  join: async (inviteCode, userId) => {
    // Find group by invite code
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id, name, invite_code, created_at')
      .eq('invite_code', inviteCode)
      .single();

    if (groupError || !group) {
      throw new Error('Invalid invite code');
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', group.id)
      .eq('user_id', userId)
      .single();

    if (existingMember) {
      throw new Error('You are already a member of this group');
    }

    // Check group size
    const { count, error: countError } = await supabase
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', group.id);

    if (countError) {
      throw countError;
    }

    if (count && count >= 4) {
      throw new Error('This group is already full (max 4 members)');
    }

    // Add user to group
    const { error: joinError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: userId,
        joined_at: new Date().toISOString(),
      });

    if (joinError) {
      throw joinError;
    }

    return {
      id: group.id,
      name: group.name,
      inviteCode: group.invite_code,
      createdAt: group.created_at,
    };
  },

  leave: async (groupId, userId) => {
    // Remove user from group
    const { error: leaveError } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (leaveError) {
      throw leaveError;
    }

    // Check if group is now empty
    const { count, error: countError } = await supabase
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', groupId);

    if (countError) {
      throw countError;
    }

    // If group is empty, delete it
    if (count === 0) {
      const { error: deleteError } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (deleteError) {
        throw deleteError;
      }

      return { deleted: true };
    }

    return { deleted: false };
  },

  getUserGroups: async (userId) => {
    // Get groups user is a member of
    const { data: groups, error: groupsError } = await supabase
      .from('group_members')
      .select(`
        groups (
          id,
          name,
          invite_code,
          created_at
        )
      `)
      .eq('user_id', userId);

    if (groupsError) {
      throw groupsError;
    }

    const groupsWithMembers = await Promise.all(
      groups.map(async (item) => {
        const group = item.groups;
        
        // Get members for each group
        const { data: members, error: membersError } = await supabase
          .from('group_members')
          .select(`
            users (
              id,
              name,
              status,
              last_updated
            )
          `)
          .eq('group_id', group.id);

        if (membersError) {
          throw membersError;
        }

        return {
          id: group.id,
          name: group.name,
          inviteCode: group.invite_code,
          createdAt: group.created_at,
          members: members.map((member) => ({
            id: member.users.id,
            name: member.users.name,
            status: member.users.status,
            lastUpdated: member.users.last_updated,
          })),
        };
      })
    );

    return groupsWithMembers;
  },
};

// Notification operations
export const notificationDb = {
  create: async (notifications) => {
    if (notifications.length === 0) return;

    const { error } = await supabase
      .from('notifications')
      .insert(
        notifications.map(notification => ({
          id: notification.id,
          user_id: notification.userId,
          user_name: notification.userName,
          group_id: notification.groupId,
          group_name: notification.groupName,
          message: notification.message,
          timestamp: notification.timestamp,
          read: notification.read,
        }))
      );

    if (error) {
      throw error;
    }
  },

  getUserNotifications: async (userId) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(notification => ({
      id: notification.id,
      userId: notification.user_id,
      userName: notification.user_name,
      groupId: notification.group_id,
      groupName: notification.group_name,
      message: notification.message,
      timestamp: notification.timestamp,
      read: notification.read,
    }));
  },

  markRead: async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      throw error;
    }

    return { success: true };
  },
};