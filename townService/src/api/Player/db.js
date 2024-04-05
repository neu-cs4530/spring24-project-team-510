/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@supabase/supabase-js';

// require('dotenv').config();
// const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY)
export const supabase = createClient(
  'https://bvevhrvfqwciuokadumx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2ZXZocnZmcXdjaXVva2FkdW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MjM0NDMsImV4cCI6MjAyNjE5OTQ0M30.iPleffF5HuzrL65TjqmaHVevm4_5jAAUmbPig50Jbog',
);
// CRUD functions for table Users
export async function createUser(userid, username, status) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ userid, username, status }])
    .select();

  return { data, error };
}

export async function readUser(userId) {
  const { data, error } = await supabase.from('users').select('*').eq('userid', userId);

  return { data, error };
}

export async function readUserName(userId) {
  const { data, error } = await supabase.from('users').select('username').eq('userid', userId);

  return { data, error };
}

export async function readUserStatus(userId) {
  const { data, error } = await supabase.from('users').select('status').eq('userid', userId);

  return { data, error };
}

export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*');

  return { data, error };
}

export async function updateUserStatus(userId, newUserStatus) {
  const { data, error } = await supabase
    .from('users')
    .update({ status: newUserStatus })
    .eq('userid', userId)
    .select();

  return { data, error };
}

export async function isUserIdValid(userId) {
  const { data, error } = await supabase.from('users').select('userid').eq('userid', userId);

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return false;
  }

  return data.length > 0;
}

export async function deleteUser(userId) {
  const { data, error } = await supabase.from('users').delete().eq('userid', userId).select();
  return { data, error };
}

// CRUD functions for table Friends
export async function addFriend(userId, friendId) {
  const { data, error } = await supabase
    .from('friends')
    .insert([
      { userid: userId, friendid: friendId },
      { userid: friendId, friendid: userId },
    ])
    .select();

  return { data, error };
}

export async function getFriends(userId) {
  const { data, error } = await supabase.from('friends').select('friendid').eq('userid', userId);

  return { data, error };
}

export async function deleteFriend(userId, friendId) {
  const [firstHalfResult, secondHalfResult] = await Promise.all([
    supabase.from('friends').delete().match({ userid: userId, friendid: friendId }),
    supabase.from('friends').delete().match({ userid: friendId, friendid: userId }),
  ]);

  const errors = [];
  if (firstHalfResult.error) {
    errors.push(`Error removing user as friend: ${firstHalfResult.error.message}`);
  }
  if (secondHalfResult.error) {
    errors.push(`Error removing friend as user: ${secondHalfResult.error.message}`);
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }
  return { success: true, message: 'Friendship removed successfully.' };
}

// CRUD functions for table Groups
export async function createGroup(groupName, adminId) {
  const { data, error } = await supabase
    .from('Groups')
    .insert([{ groupname: groupName, adminid: adminId }])
    .select('groupid')
    .single();
  return data.groupid;
}

export async function getAllGroups() {
  const { data, error } = await supabase.from('Groups').select('*');

  return { data, error };
}

export async function getGroupById(groupId) {
  const { data, error } = await supabase.from('Groups').select('*').eq('groupid', groupId).single();

  return { data, error };
}

export async function updateGroupName(groupId, newName) {
  const { data, error } = await supabase
    .from('Groups')
    .update({ groupname: newName })
    .match({ groupid: groupId })
    .select();

  return { data, error };
}

export async function updateGroupAdmin(groupId, newAdmin) {
  const { data, error } = await supabase
    .from('Groups')
    .update({ adminid: newAdmin })
    .match({ groupid: groupId })
    .select();

  return { data, error };
}

export async function deleteGroup(groupId) {
  const { data, error } = await supabase
    .from('Groups')
    .delete()
    .match({ groupid: groupId })
    .select();

  return { data, error };
}

// CRUD functions for table GroupMembers
export async function addGroupMember(groupId, memberId, isAdmin = false) {
  const { data, error } = await supabase
    .from('groupmembers')
    .insert([{ groupid: groupId, memberid: memberId, isadmin: isAdmin }])
    .select();

  return { data, error };
}

export async function getGroupMembers(groupId) {
  const { data, error } = await supabase.from('groupmembers').select('*').eq('groupid', groupId);

  return { data, error };
}

export async function getGroupIdByPlayerId(playerId) {
  const { data, error } = await supabase
    .from('groupmembers')
    .select('groupid')
    .eq('memberid', playerId)
    .maybeSingle();

  return data ? data.groupid : null;
}

export async function checkIfAdmin(groupId, memberId) {
  const { data, error } = await supabase
    .from('groupmembers')
    .select('isadmin')
    .match({ groupid: groupId, memberid: memberId })
    .single();

  return { data, error };
}
export async function removeGroupMember(groupId, memberId) {
  const { data, error } = await supabase
    .from('groupmembers')
    .delete()
    .match({ groupid: groupId, memberid: memberId })
    .select();

  return { data, error };
}

export async function updateMemberAdminStatus(groupId, memberId, isAdmin) {
  const { data, error } = await supabase
    .from('groupmembers')
    .update({ isadmin: isAdmin })
    .match({ groupid: groupId, memberid: memberId });

  return { data, error };
}

// CRUD functions for table Friend Request
export async function createFriendRequest(requestorId, receiverId) {
  const { data, error } = await supabase
    .from('friendrequests')
    .insert([{ requestorid: requestorId, receiverid: receiverId, requeststatus: 'PENDING' }])
    .select();

  console.log('Friend request sent');
  return { data, error };
}

export async function getReceivedFriendRequests(receiverId) {
  const { data, error } = await supabase
    .from('friendrequests')
    .select('*')
    .eq('receiverid', receiverId)
    .eq('requeststatus', 'PENDING');

  return { data, error };
}
export async function getFriendRequestorId(friend) {
  const { data, error } = await supabase
    .from('friendrequests')
    .select('requestorid')
    .eq('receiverid', friend)
    .eq('requeststatus', 'PENDING');

  return { data, error };
}

export async function updateFriendRequestStatus(requestorId, newStatus) {
  const { data, error } = await supabase
    .from('friendrequests')
    .update({ requeststatus: newStatus })
    .eq('requestorid', requestorId)
    .select();

  return { data, error };
}

export async function deleteFriendRequest(requestorId) {
  const { data, error } = await supabase
    .from('friendrequests')
    .delete()
    .eq('requestorid', requestorId)
    .select();

  return { data, error };
}

// CRUD functions for table Group Request
export async function sendGroupRequest(groupId, requestorId, receiverId) {
  const { data, error } = await supabase
    .from('grouprequests')
    .insert([{ groupid: groupId, requestorid: requestorId, receiverid: receiverId }])
    .select();

  return { data, error };
}

export async function getReceivedGroupRequests(receiverId) {
  const { data, error } = await supabase
    .from('grouprequests')
    .select('*')
    .eq('receiverid', receiverId);

  return { data, error };
}

export async function updateGroupRequestStatus(requestId, newStatus) {
  const { data, error } = await supabase
    .from('grouprequests')
    .update({ requeststatus: newStatus })
    .eq('requestid', requestId)
    .select();

  return { data, error };
}

export async function deleteGroupRequest(requestId) {
  const { data, error } = await supabase
    .from('grouprequests')
    .delete()
    .eq('requestid', requestId)
    .select();

  return { data, error };
}

// CRUD functions for table Teleport Request
export async function createTeleportRequest(requestorId, receiverId) {
  const { data, error } = await supabase
    .from('teleportrequests')
    .insert([{ requestorid: requestorId, receiverid: receiverId }])
    .select();

  return { data, error };
}

export async function getReceivedTeleportRequests(receiverId) {
  const { data, error } = await supabase
    .from('teleportrequests')
    .select('*')
    .eq('receiverid', receiverId);

  return { data, error };
}

export async function updateTeleportRequestStatus(requestId, newStatus) {
  const { data, error } = await supabase
    .from('teleportrequests')
    .update({ requeststatus: newStatus })
    .eq('requestid', requestId)
    .select();

  return { data, error };
}

export async function deleteTeleportRequest(requestId) {
  const { data, error } = await supabase
    .from('teleportrequests')
    .delete()
    .eq('requestid', requestId)
    .select();

  return { data, error };
}

export async function updateTeleportRequestLocation(requestId, new_x, new_y) {
  const { data, error } = await supabase
    .from('teleportrequests')
    .update({ receiver_x: new_x, receiver_y: new_y })
    .eq('requestid', requestId)
    .select();

  return { data, error };
}
