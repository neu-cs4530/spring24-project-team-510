import { ChakraProvider } from '@chakra-ui/react';
import TownController, * as TownControllerHooks from '../../classes/TownController';
import TownControllerContext from '../../contexts/TownControllerContext';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { mock, mockReset } from 'jest-mock-extended';
// import { nanoid } from 'nanoid';
// import { act } from 'react-dom/test-utils';
import React from 'react';
import FriendList from './FriendList';
import * as db from '../../../../townService/src/api/Player/db';
//import { m } from 'framer-motion';

//jest.mock('../../../../townService/src/api/Player/db');
const townController = mock<TownController>();
//const myId = townController.userID;
//mockReset(townController);



function renderFriendList() {
    return render(<ChakraProvider>
        <TownControllerContext.Provider value={townController}>
            <FriendList />;
        </TownControllerContext.Provider>
    </ChakraProvider>,);
}

beforeEach(() => {
    // renderFriendList();
    // fireEvent.click(screen.getByRole('button', { name: /Friends/i }));
});

describe('FriendList', () => {
    describe('Friends tab', () => {
        test.only('The tab is rendered', async () => {
            renderFriendList();
            fireEvent.click(screen.getByRole('button', { name: /Friends/i }));
            expect(screen.getByRole('tab', { name: /Friends/i })).toBeInTheDocument();
        });
        describe('When clicked', () => {
            it('Goes to the Friends page, and the page renders', () => {
                expect(screen.getByText('NO FRIENDS')).toBeInTheDocument();
            });
        });
    });
    describe('Group tab', () => {
        test('The tab is rendered', () => {
            expect(screen.getByRole('tab', { name: /Group/i })).toBeInTheDocument();
        });
        describe('When clicked', () => {
            it('Goes to the Group page', () => {
                const groupTab = screen.getByRole('tab', { name: /Group/i });
                fireEvent.click(groupTab);
                expect(screen.getByRole('button', { name: /Leave/i })).toBeInTheDocument();
            });
        });
    });
    describe('Requests tab', () => {
        test('The tab is rendered', () => {
            expect(screen.getByRole('tab', { name: 'Requests' })).toBeInTheDocument();
        });
        describe('When clicked', () => {
            it('Goes to the Requests page', () => {
                const requestsTab = screen.getByRole('tab', { name: /Requests/i });
                fireEvent.click(requestsTab);
                expect(screen.getByText('Friend Request')).toBeInTheDocument();
                expect(screen.getByText('Group Request')).toBeInTheDocument();
                expect(screen.getByText('Teleport Request')).toBeInTheDocument();
            });
        });
        test('Friend Request page', () => {
            // test.only('displays friend requests when available', async () => {
            //     jest.spyOn(db, 'getReceivedFriendRequests').mockResolvedValue({
            //         data: [{ requestorid: 'user123', receiverid: '4567', requeststatus: 'PENDING' }],
            //         error: null});

            //     jest.spyOn(db, 'readUserName').mockResolvedValue({
            //             data: [{ username: 'Bob'}],
            //             error: null
            //         });

            //     renderFriendsPage();
            //     fireEvent.click(screen.getByRole('button', { name: /Friends/i }));
            //     fireEvent.click(screen.getByRole('tab', { name: /Requests/i }));
            //     fireEvent.click(screen.getByRole('tab', { name: /Friend Request/i }));

            //     await waitFor(() => {
            //         const requestTextBob = screen.getByText(/Bob/i);
            //         expect(requestTextBob).toBeInTheDocument();
            //       });
            // });
            const requestsTab = screen.getByRole('tab', { name: /Requests/i });
            fireEvent.click(requestsTab);
            const friendRequestTab = screen.getByRole('tab', { name: /Friend Request/i });
            fireEvent.click(friendRequestTab);
            expect(screen.getByText('No Friend Request')).toBeInTheDocument();
        });
        test('Group Request page', () => {
            const requestsTab = screen.getByRole('tab', { name: /Requests/i });
            fireEvent.click(requestsTab);
            const groupRequestTab = screen.getByRole('tab', { name: /Group Request/i });
            fireEvent.click(groupRequestTab);
            expect(screen.getByText('No Group Request')).toBeInTheDocument();
        });
        test('Teleport Request page', () => {
            const requestsTab = screen.getByRole('tab', { name: /Requests/i });
            fireEvent.click(requestsTab);
            const teleportRequestTab = screen.getByRole('tab', { name: /Teleport Request/i });
            fireEvent.click(teleportRequestTab);
            expect(screen.getByText('No Teleport Request')).toBeInTheDocument();
        });
    });
    describe('Add tab', () => {
        test('The tab is rendered', () => {
            expect(screen.getByRole('tab', { name: /Add/i })).toBeInTheDocument();
        });
        describe('When clicked', () => {
            it('Goes to the Add page, and the page renders', () => {
                const addTab = screen.getByRole('tab', { name: 'Add' });
                fireEvent.click(addTab);
                expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
                expect(screen.getByRole('InputLeftAddon', { name: /Player ID/i })).toBeInTheDocument();
            });
        });
    });
});
