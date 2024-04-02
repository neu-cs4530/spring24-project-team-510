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
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import useTownController from '../../hooks/useTownController';
import * as db from '../../../../townService/src/api/Player/db';
import { request } from 'http';
import { get } from 'lodash';
import { createClient } from '@supabase/supabase-js';
import { PlayerID } from '../../../../shared/types/CoveyTownSocket';
import TownGameScene from '../Town/TownGameScene';

type FriendRequest = {
  requestorId: string;
  requestorName: string;
};

type TeleportRequest = {
  requestorId: string;
  requestorName: string;
  requestId: bigint;
};

export default function FriendList() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const townController = useTownController();
  const thisPlayerId = townController.userID;

  const [friends, setFriends] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupLeader, setGroupLeader] = useState('');
  const [groupMembers, setGroupMembers] = useState<string[]>([]);

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [groupRequests, setGroupRequests] = useState<string[]>([]);
  const [teleportRequests, setTeleportRequests] = useState<TeleportRequest[]>([]);

  const [playerId, setPlayerId] = useState<string>('');

  useEffect(() => {
    const getFriends = async () => {
      const { data, error } = await db.getFriends(thisPlayerId);
      if (error) {
        throw new Error('error getting friends');
      }
      setFriends(data?.map(friend => friend.friendid) as string[]);
    };
    getFriends();
  }, [thisPlayerId, isOpen]);

  useEffect(() => {
    const getGroupInfo = async () => {
      const groupId = (await db.getGroupIdByPlayerId(thisPlayerId)).groupId;
      const { data, error } = await db.getGroupById(groupId);
      if (error) {
        setGroupName('');
        setGroupLeader('');
      } else {
        setGroupName(data.groupname as string);
        setGroupLeader(data.adminid as string);
      }
    };
    getGroupInfo();
  }, [thisPlayerId, isOpen]);

  useEffect(() => {
    const getGroupMembers = async () => {
      const groupId = (await db.getGroupIdByPlayerId(thisPlayerId)).groupId;
      const { data, error } = await db.getGroupMembers(groupId);
      if (error) {
        setGroupMembers([]);
      } else {
        setGroupMembers(data?.map(member => member.memberid) as string[]);
      }
    };
    getGroupMembers();
  }, [thisPlayerId, isOpen]);

  async function getUserName(userID: string): Promise<string> {
    const { data, error } = await db.readUserName(userID);
    if (error) {
      throw new Error('error getting username');
    }
    return (data && data[0]?.username) || '';
  }

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
    getFriendRequests();
  }, [thisPlayerId, isOpen]);

  useEffect(() => {
    const getGroupRequests = async () => {
      const { data, error } = await db.getReceivedGroupRequests(playerId);
      if (error) {
        throw new Error('error getting group requests');
      }
      setGroupRequests(data?.map(groupRequest => groupRequest.requestorid) as string[]);
    };
    getGroupRequests();
  }, [playerId, isOpen]);

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

      <Modal isOpen={isOpen} onClose={onClose} size='lg'>
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
                      <Tr>
                        <Th>Name</Th>
                        <Th>Status</Th>
                        <Th>Invite</Th>
                        <Th>Teleport</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {/* TODO: render the friends of our player as <tr> element, and implement on-click for Invite and Teleport button */}
                      <Tr>
                        <Td>Player1</Td>
                        <Td>Online</Td>
                        <Td>
                          <Button colorScheme='teal' variant='outline' size='sm'>
                            Invite
                          </Button>
                        </Td>
                        <Td>
                          <Button colorScheme='teal' variant='outline' size='sm'>
                            Teleport
                          </Button>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Player2</Td>
                        <Td>Online</Td>
                        <Td>
                          <Button colorScheme='teal' variant='outline' size='sm'>
                            Invite
                          </Button>
                        </Td>
                        <Td>
                          <Button colorScheme='teal' variant='outline' size='sm'>
                            Teleport
                          </Button>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Player3</Td>
                        <Td>InGame</Td>
                        <Td>
                          <Button isDisabled colorScheme='teal' variant='outline' size='sm'>
                            Invite
                          </Button>
                        </Td>
                        <Td>
                          <Button isDisabled colorScheme='teal' variant='outline' size='sm'>
                            Teleport
                          </Button>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Player4</Td>
                        <Td>Offline</Td>
                        <Td>
                          <Button isDisabled colorScheme='teal' variant='outline' size='sm'>
                            Invite
                          </Button>
                        </Td>
                        <Td>
                          <Button isDisabled colorScheme='teal' variant='outline' size='sm'>
                            Teleport
                          </Button>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Player5</Td>
                        <Td>Offline</Td>
                        <Td>
                          <Button isDisabled colorScheme='teal' variant='outline' size='sm'>
                            Invite
                          </Button>
                        </Td>
                        <Td>
                          <Button isDisabled colorScheme='teal' variant='outline' size='sm'>
                            Teleport
                          </Button>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TabPanel>
                <TabPanel>
                  {/* This is content for Group tab */}
                  <Table variant='striped' colorScheme='teal'>
                    <Thead>
                      <Tr>
                        <Th fontSize='md'>Group Members</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {/* TODO: render all the group members */}
                      <Tr>
                        <Td>Player1</Td>
                      </Tr>
                      <Tr>
                        <Td>Player2</Td>
                      </Tr>
                      <Tr>
                        <Td>Player3</Td>
                      </Tr>
                      <Tr>
                        <Td>Player4</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                  {/* TODO: implement on-click for Leave and Assemble button, hide those button if player is not in group, hide Assemble
                  button when the player is not the group leader */}
                  <ButtonGroup gap='4'>
                    <Button colorScheme='green' size='sm' variant='outline'>
                      Leave
                    </Button>
                    <Button colorScheme='green' size='sm' variant='outline'>
                      Assemble
                    </Button>
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
                      {/* This is Friend Request Panel */}
                      <TabPanel>
                        {/* TODO: render Friend Request, and implement on-click for Accept and Decline button */}
                        {FriendRequestsList()}
                      </TabPanel>
                      <TabPanel>
                        {/* This is Group Request Panel */}
                        <Table variant='striped' colorScheme='teal'>
                          <Thead></Thead>
                          <Tbody>
                            {/* TODO: render Group Request as <tr> element, and implement on-click for Accept and Decline button */}
                            <Tr>
                              <Td>Player1</Td>
                              <Td>
                                <Button colorScheme='green' size='sm' variant='outline'>
                                  Accept
                                </Button>
                              </Td>
                              <Td>
                                <Button colorScheme='red' size='sm' variant='outline'>
                                  Decline
                                </Button>
                              </Td>
                            </Tr>
                            <Tr>
                              <Td>Player2</Td>
                              <Td>
                                <Button colorScheme='green' size='sm' variant='outline'>
                                  Accept
                                </Button>
                              </Td>
                              <Td>
                                <Button colorScheme='red' size='sm' variant='outline'>
                                  Decline
                                </Button>
                              </Td>
                            </Tr>
                            <Tr>
                              <Td>Player3</Td>
                              <Td>
                                <Button colorScheme='green' size='sm' variant='outline'>
                                  Accept
                                </Button>
                              </Td>
                              <Td>
                                <Button colorScheme='red' size='sm' variant='outline'>
                                  Decline
                                </Button>
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TabPanel>
                      <TabPanel>
                        {/* This is Teleport Request Panel */}
                        <Table variant='striped' colorScheme='teal'>
                          <Thead></Thead>
                          <Tbody>
                            {/* TODO: render Teleport Request as <tr> element, and implement on-click for Accept and Decline button */}
                            {TeleportRequestsList()}
                          </Tbody>
                        </Table>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </TabPanel>
                {/* This is Add Friend Panel */}
                <TabPanel>
                  {/* implement on-click for Add button here */}
                  {AddFriendComponent()}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
