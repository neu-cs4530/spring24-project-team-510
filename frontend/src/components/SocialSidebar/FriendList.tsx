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
} from '@chakra-ui/react';
import React, { useState } from 'react';
import useTownController from '../../hooks/useTownController';
import * as db from '../../../../db';

export default function FriendList() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const townController = useTownController();

  const [friends, setFriends] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupLeader, setGroupLeader] = useState(0);
  const [groupMembers, setGroupMembers] = useState([]);

  const [friendRequests, setFriendRequests] = useState([]);
  const [groupRequests, setGroupRequests] = useState([]);
  const [teleportRequests, setTeleportRequests] = useState([]);

  const getFriendInfo = async () => {
    const { data, error } = await db.getFriends(townController.userID);
    if (error || data == null) {
      throw new Error('error getting friends');
    }
    console.log(townController.userID);
    console.log(data);
    setFriends(data as unknown[] as string[]);
    console.log(friends);
  };

  return (
    <>
      <Button onClick={getFriendInfo}>Friends</Button>

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
                        <Table variant='striped' colorScheme='teal'>
                          <Thead></Thead>
                          <Tbody>
                            {/* TODO: render Friend Request, and implement on-click for Accept and Decline button */}
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
                            <Tr>
                              <Td>Player4</Td>
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
                            <Tr>
                              {/* TODO: render Teleport Request as <tr> element, and implement on-click for Accept and Decline button */}
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
                          </Tbody>
                        </Table>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </TabPanel>
                {/* This is Add Friend Panel */}
                <TabPanel>
                  {/* implement on-click for Add button here */}
                  <InputGroup>
                    <InputLeftAddon>Player ID</InputLeftAddon>
                    <Input />
                    <InputRightElement>
                      <Button>Add</Button>
                    </InputRightElement>
                  </InputGroup>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
