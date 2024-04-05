//import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
// import { mock, mockReset } from 'jest-mock-extended';
// import { nanoid } from 'nanoid';
// import { act } from 'react-dom/test-utils';
import React from 'react';
import FriendList from './FriendList';
import * as api from './api'; // replace './api' with our actual file
//import { m } from 'framer-motion';

jest.mock('./api');

const mockFriendsData = [
    { name: 'Francisx1999', status: 'Online' },
    { name: 'Frank', status: 'In-Game' },
    { name: 'Archer', status: 'Online' },
    { name: 'Cyborg99', status: 'In-game' },
    { name: 'Flsheye', status: 'Offline' },
    { name: 'Scorplon', status: 'Offline' },
];

describe('FriendList', () => {
    function renderFriendsPage(friendsData: any[]) { // mock Type friend?
        // or just use render(<FriendList />)
        return render(<FriendList friends={friendsData} />);
    }
    function renderAddFriendPage() {
        // or just use render(<FriendList />)
    }
    describe('Friends page', () => {
        describe('Friends button', () => {
            it('Is not clickable', () => {
                renderFriendsPage([]);
                const friendsButton = screen.getByText('Friends');
                expect(friendsButton).toBeDisabled();
            });
            test('The button is rendered', () => {
                renderFriendsPage([]);
                expect(screen.getByText('Friends')).toBeInTheDocument();
            });
        });
        describe('Group button', () => {
            test('The button is rendered', () => {
                renderFriendsPage([]);
                expect(screen.getByText('Group')).toBeInTheDocument();
            });
            describe('When clicked', () => {
                it('Goes to the Group page', () => {
                    renderFriendsPage([]);
                    const groupButton = screen.getByText('Group');
                    fireEvent.click(groupButton);
                    expect(screen.getByRole('button', { name: /Assemble/i })).toBeInTheDocument();
                    expect(screen.getByRole('button', { name: /Leave/i })).toBeInTheDocument();
                });
            });
        });
        describe('Friend requests button', () => {
            test('The button is rendered', () => {
                renderFriendsPage([]);
                expect(screen.getByRole('button', { name: 'Friend requests' })).toBeInTheDocument();
            });
            describe('When clicked', () => {
                it('Goes to the Friend Requests page', () => {
                    renderFriendsPage([]);
                    const friendRequestsButton = screen.getByRole('button', { name: /Friend requests/i });
                    fireEvent.click(friendRequestsButton);
                    expect(screen.getByText('Friend Requests')).toBeInTheDocument();

                    // Check for a message indicating there are no requests if that's part of your UI
                    const noRequestsMessage = screen.queryByText(/No friend requests/i);
                    const acceptButton = screen.queryByRole('button', { name: /Accept/i });
                    const declineButton = screen.queryByRole('button', { name: /Decline/i });

                    // If there's a message indicating no requests, then Accept and Decline buttons should not be present
                    if (noRequestsMessage) {
                        expect(acceptButton).not.toBeInTheDocument();
                        expect(declineButton).not.toBeInTheDocument();
                    } else {
                        // If there's no such message, then there should be friend requests with Accept and Decline buttons
                        expect(acceptButton).toBeInTheDocument();
                        expect(declineButton).toBeInTheDocument();
                    }
                });
            });
        });
        describe('Add friend button', () => {
            test('The button is rendered', () => {
                renderFriendsPage([]);
                expect(screen.getByRole('button', { name: /Add friend/i })).toBeInTheDocument();
            });
            describe('When clicked', () => {
                it('Goes to the Add Friend page', () => {
                    renderFriendsPage([]);
                    const addFriendButton = screen.getByRole('button', { name: 'Add friend' });
                    fireEvent.click(addFriendButton);
                    expect(screen.getByText('Add Friend')).toBeInTheDocument();
                    expect(screen.getByRole('button', { name: /Send friend request/i })).toBeInTheDocument();
                    expect(screen.getByRole('button', { name: /Go back/i })).toBeInTheDocument();
                });
            });
        });
        test('Friend list is correctly rendered when there is no friend', () => {
            renderFriendsPage([]);
            expect(screen.getByText('No friends yet')).toBeInTheDocument();
        });
        describe('Each friend in the friend list', () => {
            it('Is correctly rendered with its name, status, invite button and teleport button', () => {
                mockFriendsData.forEach(friend => {
                    // Verify that the friend's name is rendered
                    expect(screen.getByText(friend.name)).toBeInTheDocument();

                    const friendComponent = screen.getByText(friend.name).closest('article'); // Adjust the element selector as needed

                    if (friendComponent) {
                        const inviteButton = within(friendComponent).getByRole('button', { name: /Invite/i });
                        expect(inviteButton).toBeInTheDocument();

                        const teleportButton = within(friendComponent).getByRole('button', { name: /Teleport/i });
                        expect(teleportButton).toBeInTheDocument();

                        const status = within(friendComponent).getByText(friend.status);
                        expect(status).toBeInTheDocument();
                    } else {
                        throw new Error('No friend component found');
                    }
                });
            });
            describe('Invite button', () => {
                it('Is not clikcable if the friend is offline', () => {
                    renderFriendsPage(mockFriendsData);
                    const offlineStatus = screen.getByText(/Offline/i);
                    const offlineFriend = offlineStatus?.closest('article'); // Adjust the element selector as needed

                    if (offlineFriend) {
                        const inviteButton = within(offlineFriend).getByRole('button', { name: /Invite/i });
                        expect(inviteButton).toBeDisabled();
                    } else {
                        throw new Error('No offline friend found');
                    }
                });
                describe('When clicked', () => {

                });
                describe('Teleport button', () => {
                    it('Is not clikcable if the friend is offline', () => {
                        api.playerStatus = 'Online';

                        renderFriendsPage(mockFriendsData);
                        const offlineStatus = screen.getByText(/Offline/i);
                        const offlineFriend = offlineStatus?.closest('article'); // Adjust the element selector as needed

                        if (offlineFriend) {
                            const teleportButton = within(offlineFriend).getByRole('button', { name: /Teleport/i });
                            expect(teleportButton).toBeDisabled();
                        } else {
                            throw new Error('No offline friend found');
                        }
                    });
                    it('Is not clikcable if the player is in-game', () => {
                        // player's status is in-game
                        api.playerStatus = 'In-game';

                        renderFriendsPage(mockFriendsData);
                        const onlineStatus = screen.getByText(/Online/i);
                        const onlineFriend = onlineStatus?.closest('article'); // Adjust the element selector as needed

                        if (onlineFriend) {
                            const teleportButton = within(onlineFriend).getByRole('button', { name: /Teleport/i });
                            expect(teleportButton).toBeDisabled();
                        } else {
                            throw new Error('No online friend found');
                        }
                    });
                    describe('When clicked', () => {
                        it('Sends a teleport request to that friend', async () => {
                            api.playerStatus = 'Online';

                            renderFriendsPage(mockFriendsData);
                            const onlineStatus = screen.getByText(/Online/i);
                            const onlineFriend = onlineStatus?.closest('article'); // Adjust the element selector as needed

                            if (onlineFriend) {
                                const teleportButton = within(onlineFriend).getByRole('button', { name: /Teleport/i });
                                fireEvent.click(teleportButton);
                                await waitFor(() => expect(api.teleportPermisson).toHaveBeenCalledWith(/* expected arguments */));
                            } else {
                                throw new Error('No online friend found');
                            }
                        });
                        it('Calls the teleport method to teleport to the friend if permission is granted', async () => {
                            api.teleportPermisson.mockResolvedValue(true);

                            renderFriendsPage(mockFriendsData);
                            const onlineStatus = screen.getByText(/Online/i);
                            const onlineFriend = onlineStatus?.closest('article'); // Adjust the element selector as needed

                            if (onlineFriend) {
                                const teleportButton = within(onlineFriend).getByRole('button', { name: /Teleport/i });
                                fireEvent.click(teleportButton);
                                await waitFor(() => expect(api.teleport).toHaveBeenCalledWith(/* expected arguments */));
                            } else {
                                throw new Error('No online friend found');
                            }
                        });
                        it('Gets into cool down', async () => {

                        });
                    });
                });
            });
        });
        describe('Group page', () => {
            describe('Assemble button', () => {

            });
            describe('Leave button', () => {

            });
        });
        describe('Friend requests page', () => {
            describe('Accept button', () => {

            });
            describe('Decline button', () => {

            });
        });
        describe('Add friend page', () => {
            describe('Send friend request button', () => {
                test('The button is rendered', () => {
                    renderAddFriendPage();
                    expect(screen.getByRole('button', { name: /Send friend request/i })).toBeInTheDocument();
                });
                describe('When clicked', () => {
                    it('sends a friend request if has player ID input', async () => {
                        renderAddFriendPage();
                        // Mock the sendFriendRequest function to resolve successfully
                        api.sendFriendRequest.mockResolvedValueOnce({ success: true });

                        const addFriendInput = screen.getByLabelText(/Player ID/i);
                        const sendRequestButton = screen.getByRole('button', { name: /Add Friend/i });

                        fireEvent.change(addFriendInput, { target: { value: '2931085415' } });
                        fireEvent.click(sendRequestButton);

                        // Wait for the API call to resolve and the success message to be displayed
                        await waitFor(() => expect(screen.getByText(/Success: Request sent/i)).toBeInTheDocument());

                        // Assert the mocked API function was called with the correct argument
                        expect(api.sendFriendRequest).toHaveBeenCalledWith('2931085415');
                    });
                });
            });
            describe('Go back button', () => {

            });
        });
    });
});
