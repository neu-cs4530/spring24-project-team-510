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
} from '@chakra-ui/react';
import React from 'react';

export default function FriendList() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Friends</Button>

      <Modal isOpen={isOpen} onClose={onClose} size='lg'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Friends Menu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted variant='soft-rounded' colorScheme='green'>
              <TabList>
                <Tab>Friends</Tab>
                <Tab>Group</Tab>
                <Tab>Requests</Tab>
                <Tab>Add</Tab>
              </TabList>

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
                  <Table variant='striped' colorScheme='teal'>
                    <Thead>
                      <Tr>
                        <Th>Group Members</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
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
                </TabPanel>
                <TabPanel>
                  <Table variant='striped' colorScheme='teal'>
                    <Thead></Thead>
                    <Tbody>
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
