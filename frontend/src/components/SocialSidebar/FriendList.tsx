import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ButtonGroup,
  PinInputField,
  Heading,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import useTownController from '../../hooks/useTownController';
import * as db from '../../../../townService/src/api/Player/db';
import { request } from 'http';
import { get } from 'lodash';
import { createClient } from '@supabase/supabase-js';
import { PlayerID, PlayerLocation } from '../../../../shared/types/CoveyTownSocket';
import TownGameScene from '../Town/TownGameScene';

type FriendRequest = {
  requestorId: string;
  requestorName: string;
};

type GroupRequest = {
  requestId: bigint;
  groupId: bigint;
  requestorId: string;
  requestorName: string;
};

type TeleportRequest = {
  requestorId: string;
  requestorName: string;
  requestId: bigint;
};

type Friend = {
  friendId: string;
  friendName: string;
};

type GroupMember = {
  memberId: string;
  memberName: string;
  isAdmin: boolean;
  groupId: bigint;
};

const hangoutRoomTeleportLocation: PlayerLocation = {
  moving: false,
  rotation: 'front',
  x: 2977.8333333333076,
  y: 90.83333333333306,
};

export default function FriendList() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const townController = useTownController();
  const thisPlayerId = townController.userID;

  const [friends, setFriends] = useState<Friend[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupLeader, setGroupLeader] = useState('');
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [groupRequests, setGroupRequests] = useState<GroupRequest[]>([]);
  const [teleportRequests, setTeleportRequests] = useState<TeleportRequest[]>([]);

  const [playerId, setPlayerId] = useState<string>('');

  async function getUserName(userID: string): Promise<string> {
    const { data, error } = await db.readUserName(userID);
    if (error) {
      throw new Error('error getting username');
    }
    return (data && data[0]?.username) || '';
  }

  const getFriends = async () => {
    const { data, error } = await db.getFriends(thisPlayerId);
    if (error) {
      throw new Error('error getting friends');
    }
    const curFriends = await Promise.all(
      data?.map(async friend => {
        const friendName = (await getUserName(friend.friendid)).toString();
        return {
          friendId: friend.friendid,
          friendName: friendName,
        };
      }) || [],
    );
    setFriends(curFriends as Friend[]);
  };

  const getGroupMembers = async () => {
    const groupIDofThisPlayer = await db.getGroupIdByPlayerId(thisPlayerId);
    if (groupIDofThisPlayer === null) {
      setGroupMembers([]);
      return;
    }

    const { data, error } = await db.getGroupMembers(groupIDofThisPlayer);
    if (error) {
      throw new Error('error getting group members');
    }
    const curGroupMembers = await Promise.all(
      data?.map(async GroupMember => {
        const groupMemberName = (await getUserName(GroupMember.memberid)).toString();
        return {
          memberId: GroupMember.memberid,
          memberName: groupMemberName,
          isAdmin: GroupMember.isadmin,
          groupId: GroupMember.groupid,
        };
      }) || [],
    );
    setGroupMembers(curGroupMembers as GroupMember[]);
  };

  const getGroupLeader = async () => {
    const groupIDofThisPlayer = await db.getGroupIdByPlayerId(thisPlayerId);
    const { data, error } = await db.checkIfAdmin(groupIDofThisPlayer, thisPlayerId);
    if (error) {
      return;
    }
    if (data && data.isadmin) {
      setGroupLeader(thisPlayerId as string);
    } else {
      return;
    }
  };

  const getFriendRequests = async () => {
    const { data, error } = await db.getReceivedFriendRequests(thisPlayerId);
    if (error) {
      throw new Error('error getting friend requests');
    }

    const curFriendRequests = await Promise.all(
      data?.map(async friendRequest => {
        const requestorName = (await getUserName(friendRequest.requestorid)).toString();
        return {
          requestorId: friendRequest.requestorid,
          requestorName: requestorName,
        };
      }) || [],
    );
    setFriendRequests(curFriendRequests as FriendRequest[]);
  };

  const getGroupRequests = async () => {
    const { data, error } = await db.getReceivedGroupRequests(thisPlayerId);
    if (error) {
      throw new Error('error getting group requests');
    }

    const curGroupRequests = await Promise.all(
      data?.map(async groupRequest => {
        const requestorName = (await getUserName(groupRequest.requestorid)).toString();
        const requestorId = groupRequest.requestorid;
        return {
          requestId: groupRequest.requestid,
          groupId: groupRequest.groupid,
          requestorId: requestorId,
          requestorName: requestorName,
        };
      }) || [],
    );
    setGroupRequests(curGroupRequests as GroupRequest[]);
  };

  const getTeleportRequests = async () => {
    const { data, error } = await db.getReceivedTeleportRequests(thisPlayerId);
    if (error) {
      throw new Error('error getting teleport requests');
    }

    const curTeleportRequests = await Promise.all(
      data?.map(async teleportRequest => {
        const requestorId: string = teleportRequest.requestorid;
        const requestorName = (await getUserName(requestorId)).toString();
        return {
          requestorId: requestorId,
          requestorName: requestorName,
          requestId: teleportRequest.requestid,
        };
      }) || [],
    );
    setTeleportRequests(curTeleportRequests as TeleportRequest[]);
  };

  useEffect(() => {
    getFriends();
  }, [thisPlayerId, isOpen]);

  useEffect(() => {
    getFriendRequests();
  }, [thisPlayerId, isOpen]);

  useEffect(() => {
    getGroupRequests();
  }, [thisPlayerId, isOpen]);

  useEffect(() => {
    getGroupLeader();
  }, [thisPlayerId, isOpen]);

  useEffect(() => {
    getGroupMembers();
  }, [thisPlayerId, isOpen]);

  useEffect(() => {
    getTeleportRequests();
  }, [playerId, isOpen]);

  async function acceptFriendRequest(requestorId: string) {
    await db.addFriend(townController.userID, requestorId);
    await db.deleteFriendRequest(requestorId);
    getFriendRequests();
  }

  async function declineFriendRequest(requestorId: string) {
    await db.deleteFriendRequest(requestorId);
    getFriendRequests();
  }

  async function acceptGroupRequest(requestId: bigint, groupId: bigint) {
    const currentGroupId = await db.getGroupIdByPlayerId(townController.userID);
    if (currentGroupId) {
      await db.removeGroupMember(currentGroupId, townController.userID);
    }
    const addMemberResponse = await db.addGroupMember(groupId, townController.userID);
    if (addMemberResponse.error) {
      console.error('Error adding group member:', addMemberResponse.error);
      return;
    }
    const deleteRequestResponse = await db.deleteGroupRequest(requestId);
    if (deleteRequestResponse.error) {
      console.error('Error deleting group request:', deleteRequestResponse.error);
      return;
    }
    getGroupRequests();
  }

  async function declineGroupRequest(requestId: bigint) {
    await db.deleteGroupRequest(requestId);
    getGroupRequests();
  }

  async function acceptTeleportRequest(requestId: bigint, requestorId: string) {
    const newLocation = townController.getPlayer(requestorId as PlayerID).location;
    onClose();
    townController.emitMovement(newLocation);
    townController.townGameScene.moveOurPlayerTo(newLocation);
    await db.deleteTeleportRequest(requestId);
    getTeleportRequests();
  }

  async function declineTeleportRequest(requestId: bigint) {
    await db.deleteTeleportRequest(requestId);
    getTeleportRequests();
  }

  async function leaveGroup(groupid: bigint) {
    const { data, error } = await db.checkIfAdmin(groupid, thisPlayerId);
    if (error) {
      return;
    }
    if (data && data.isadmin) {
      await db.deleteGroup(groupid);
    } else {
      await db.removeGroupMember(groupid, thisPlayerId);
    }
    getGroupMembers();
  }

  async function createGroupRequest(friendId: string) {
    let groupId = await db.getGroupIdByPlayerId(townController.ourPlayer.id);
    if (groupId) {
      await db.sendGroupRequest(groupId, townController.ourPlayer.id, friendId);
      console.log('Group request sent' + groupId);
    } else if (groupId === null) {
      groupId = await db.createGroup('Covey.Town', townController.ourPlayer.id);
      db.addGroupMember(groupId, townController.ourPlayer.id, true);
      console.log('Group created' + groupId);
      if (groupId) {
        await db.sendGroupRequest(groupId, townController.ourPlayer.id, friendId);
        console.log('Group request sent' + groupId);
      }
    }
  }

  async function createAssembleRequest() {
    const groupId = await db.getGroupIdByPlayerId(townController.ourPlayer.id);
    if (groupId) {
      for (const member of groupMembers) {
        if (!member.isAdmin) {
          await db.createTeleportRequest(townController.ourPlayer.id, member.memberId);
          console.log('Assemble request sent' + groupId);
        }
      }
    }
  }

  async function assembleAtHangoutRoom() {
    onClose();
    townController.emitMovement(hangoutRoomTeleportLocation);
    townController.townGameScene.moveOurPlayerTo(hangoutRoomTeleportLocation);
    createAssembleRequest();
  }

  function FriendPrompt(props: { friendId: string; friendName: string }): JSX.Element {
    return (
      <Tr>
        <Td>{props.friendName}</Td>
        <Td>Online</Td>
        <Td>
          <Button
            colorScheme='green'
            size='sm'
            variant='outline'
            onClick={() => createGroupRequest(props.friendId)}>
            Invite
          </Button>
        </Td>
        <Td>
          <Button
            colorScheme='red'
            size='sm'
            variant='outline'
            onClick={() => db.createTeleportRequest(townController.ourPlayer.id, props.friendId)}>
            Teleport
          </Button>
        </Td>
      </Tr>
    );
  }

  function GroupMemberPrompt(props: {
    groupMemberId: string;
    groupMemberName: string;
    groupId: bigint;
    isAdmin: boolean;
  }): JSX.Element {
    if (props.isAdmin) {
      return (
        <Tr>
          <Td>{props.groupMemberName}</Td>
          <Td>Group Leader</Td>
        </Tr>
      );
    }
    return (
      <Tr>
        <Td>{props.groupMemberName}</Td>
        <Td></Td>
      </Tr>
    );
  }
  function GroupRequestPrompt(props: {
    requestId: bigint;
    groupId: bigint;
    requestorId: string;
    requestorName: string;
  }): JSX.Element {
    return (
      <Tr>
        <Td>Group join request from {props.requestorName}</Td>
        <Td>
          <Button
            colorScheme='green'
            size='sm'
            variant='outline'
            onClick={() => acceptGroupRequest(props.requestId, props.groupId)}>
            Accept
          </Button>
        </Td>
        <Td>
          <Button
            colorScheme='red'
            size='sm'
            variant='outline'
            onClick={() => declineGroupRequest(props.requestId)}>
            Decline
          </Button>
        </Td>
      </Tr>
    );
  }

  function FriendRequestPrompt(props: { requestorId: string; requestorName: string }): JSX.Element {
    return (
      <Tr>
        <Td>Friend request from {props.requestorName}</Td>
        <Td>
          <Button
            colorScheme='green'
            size='sm'
            variant='outline'
            onClick={() => acceptFriendRequest(props.requestorId)}>
            Accept
          </Button>
        </Td>
        <Td>
          <Button
            colorScheme='red'
            size='sm'
            variant='outline'
            onClick={() => declineFriendRequest(props.requestorId)}>
            Decline
          </Button>
        </Td>
      </Tr>
    );
  }

  function TeleportRequestPrompt(props: {
    requestorId: string;
    requestorName: string;
    requestId: bigint;
  }): JSX.Element {
    return (
      <Tr>
        <Td>Teleport request from {props.requestorName}</Td>
        <Td>
          <Button
            colorScheme='green'
            size='sm'
            variant='outline'
            onClick={() => acceptTeleportRequest(props.requestId, props.requestorId)}>
            Accept
          </Button>
        </Td>
        <Td>
          <Button
            colorScheme='red'
            size='sm'
            variant='outline'
            onClick={() => declineTeleportRequest(props.requestId)}>
            Decline
          </Button>
        </Td>
      </Tr>
    );
  }

  // function acceptFriendRequestButton(props: { onClick: () => void }) {
  //   return (
  //     <Button colorScheme='green' size='sm' variant='outline' onClick={props.onClick}>
  //       Accept
  //     </Button>
  //   )
  // }

  const FriendsList = () => {
    console.log(thisPlayerId);
    console.log(groupLeader);
    return (
      <Table variant='striped' colorScheme='teal'>
        <Thead></Thead>
        <Tbody>
          {friends.map(friend => {
            return (
              <FriendPrompt
                key={friend.friendId}
                friendId={friend.friendId}
                friendName={friend.friendName}
              />
            );
          })}
        </Tbody>
      </Table>
    );
  };

  const GroupMembersList = () => {
    return (
      <Table variant='striped' colorScheme='teal'>
        <Thead></Thead>
        <Tbody>
          {groupMembers.map(groupMember => {
            return (
              <GroupMemberPrompt
                key={groupMember.memberId}
                groupMemberId={groupMember.memberId}
                groupMemberName={groupMember.memberName}
                isAdmin={groupMember.isAdmin}
                groupId={groupMember.groupId}
              />
            );
          })}
        </Tbody>
      </Table>
    );
  };

  const FriendRequestsList = () => {
    return (
      <Table variant='striped' colorScheme='teal'>
        <Thead></Thead>
        <Tbody>
          {friendRequests.map(friendRequest => {
            return (
              <FriendRequestPrompt
                key={friendRequest.requestorId}
                requestorId={friendRequest.requestorId}
                requestorName={friendRequest.requestorName}
              />
            );
          })}
        </Tbody>
      </Table>
    );
  };

  const GroupRequestsList = () => {
    return (
      <Table variant='striped' colorScheme='teal'>
        <Thead></Thead>
        <Tbody>
          {groupRequests.map(groupRequest => {
            return (
              <GroupRequestPrompt
                key={
                  groupRequest.requestId ? groupRequest.requestId.toString() : 'some-fallback-value'
                }
                requestId={groupRequest.requestId}
                groupId={groupRequest.groupId}
                requestorId={groupRequest.requestorId}
                requestorName={groupRequest.requestorName}
              />
            );
          })}
        </Tbody>
      </Table>
    );
  };

  const TeleportRequestsList = () => {
    return (
      <Table variant='striped' colorScheme='teal'>
        <Thead></Thead>
        <Tbody>
          {teleportRequests.map(teleportRequest => {
            return (
              <TeleportRequestPrompt
                key={teleportRequest.requestorId}
                requestorId={teleportRequest.requestorId}
                requestorName={teleportRequest.requestorName}
                requestId={teleportRequest.requestId}
              />
            );
          })}
        </Tbody>
      </Table>
    );
  };

  const AddFriendComponent = () => {
    return (
      <InputGroup>
        <InputLeftAddon>Player ID</InputLeftAddon>
        <Input
          name='playerId'
          value={playerId}
          placeholder='type playerId here'
          onChange={e => {
            setPlayerId(e.target.value);
          }}
        />
        <InputRightElement>
          <Button
            onClick={async () => {
              try {
                await db.createFriendRequest(townController.userID, playerId);
              } catch (error) {
                console.error('Error sending friend request:', error);
              }
            }}>
            Add
          </Button>
        </InputRightElement>
      </InputGroup>
    );
  };

  return (
    <>
      <Button onClick={onOpen}>Friends</Button>

      <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
        <ModalOverlay />
        <ModalContent>
          {/* This is the content box of FriendList */}
          <ModalHeader>Friends Menu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* This is tabswitch, no need to add on-click */}
            <Tabs isFitted variant='soft-rounded' colorScheme='green'>
              <TabList>
                <Tab>Friends</Tab>
                <Tab>Group</Tab>
                <Tab>Requests</Tab>
                <Tab>Add</Tab>
              </TabList>
              {/* This is the content of Friends tab */}
              <TabPanels>
                <TabPanel>
                  <Table variant='striped' colorScheme='teal'>
                    <Thead>
                      <Tr>{friends.length > 0 && <Th>Name</Th>}</Tr>
                      <Tr>{friends.length === 0 && <Th>No friends</Th>}</Tr>
                    </Thead>
                    <Tbody>
                      {/* TODO: render the friends of our player as <tr> element, and implement on-click for Invite and Teleport button */}
                      {FriendsList()}
                    </Tbody>
                  </Table>
                </TabPanel>
                <TabPanel>
                  {/* This is content for Group tab */}
                  {GroupMembersList()}
                  {/* TODO: implement on-click for Leave and Assemble button, hide those button if player is not in group, hide Assemble
                  button when the player is not the group leader */}
                  <ButtonGroup gap='4'>
                    <Button
                      colorScheme='green'
                      size='sm'
                      variant='outline'
                      onClick={async () => leaveGroup(await db.getGroupIdByPlayerId(thisPlayerId))}>
                      Leave
                    </Button>
                    <Button
                      colorScheme='green'
                      size='sm'
                      variant='outline'
                      onClick={async () => createAssembleRequest()}>
                      Assemble
                    </Button>
                    {groupLeader === thisPlayerId && (
                      <Button
                        colorScheme='green'
                        size='sm'
                        variant='outline'
                        onClick={async () => assembleAtHangoutRoom()}>
                        Hangout Room
                      </Button>
                    )}
                  </ButtonGroup>
                </TabPanel>
                <TabPanel>
                  <Tabs>
                    <TabList>
                      <Tab>Friend Request</Tab>
                      <Tab>Group Request</Tab>
                      <Tab>Teleport Request</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        {/* This is Friend Request Panel */}
                        {/* TODO: render Friend Request, and implement on-click for Accept and Decline button */}
                        {FriendRequestsList()}
                      </TabPanel>
                      <TabPanel>
                        {/* This is Group Request Panel */}
                        {/* TODO: render Group Request as <tr> element, and implement on-click for Accept and Decline button */}
                        {GroupRequestsList()}
                      </TabPanel>
                      <TabPanel>
                        {/* This is Teleport Request Panel */}
                        {/* TODO: render Teleport Request as <tr> element, and implement on-click for Accept and Decline button */}
                        {TeleportRequestsList()}
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </TabPanel>
                {/* This is Add Friend Panel */}
                <TabPanel>
                  {/* implement on-click for Add button here */}
                  {AddFriendComponent()}
                  <h3>My ID: {townController.ourPlayer.id}</h3>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
