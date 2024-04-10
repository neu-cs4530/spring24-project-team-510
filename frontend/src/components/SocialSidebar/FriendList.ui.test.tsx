import { ChakraProvider } from '@chakra-ui/react';
import TownController from '../../classes/TownController';
import TownControllerContext from '../../contexts/TownControllerContext';
import { render, screen, waitFor } from '@testing-library/react';
import { mock, mockReset } from 'jest-mock-extended';
import React from 'react';
import FriendList from './FriendList';
import userEvent from '@testing-library/user-event';

const townController = mock<TownController>();
mockReset(townController);

function renderFriendList() {
    return render(<ChakraProvider>
        <TownControllerContext.Provider value={townController}>
            <FriendList />;
        </TownControllerContext.Provider>
    </ChakraProvider>,);
}

beforeEach(async () => {
    renderFriendList();
    await userEvent.click(screen.getByRole('button', { name: /Friends/i }));
});

describe('FriendList', () => {
    describe('Friend List tab', () => {
        test('The tab is rendered', async () => {
            await waitFor(() => { expect(screen.getByRole('tab', { name: /Friend List/i })).toBeInTheDocument()});
        });
        describe('When clicked', () => {
            it('Goes to the Friend List page, and the page renders', async () => {
                const friendListTab = screen.getByRole('tab', { name: /Friend List/i });
                await userEvent.click(friendListTab);
                await waitFor(() => { expect(screen.getByText(/No friends/i)).toBeInTheDocument() });
            });
        });
    });
    describe('My Group tab', () => {
        test('The tab is rendered', async () => {
            await waitFor(() => {expect(screen.getByRole('tab', { name: /My Group/i })).toBeInTheDocument()});
        });
        describe('When clicked', () => {
            it('Goes to the My Group page', async () => {
                const groupTab = screen.getByRole('tab', { name: /My Group/i });
                await userEvent.click(groupTab);
                await waitFor(() => {expect(screen.getByText(/No Group Members/i)).toBeInTheDocument()});
                await waitFor(() => {expect(screen.getByRole('button', { name: /Leave/i })).toBeInTheDocument()});
            });
        });
    });
    describe('Requests tab', () => {
        test('The tab is rendered', async () => {
            await waitFor(() => {expect(screen.getByRole('tab', { name: 'Requests' })).toBeInTheDocument()});
        });
        describe('When clicked', () => {
            it('Goes to the Requests page', async () => {
                const requestsTab = screen.getByRole('tab', { name: /Requests/i });
                await userEvent.click(requestsTab);
                await waitFor(() => {expect(screen.getByText('Friend Request')).toBeInTheDocument()});
                await waitFor(() => {expect(screen.getByText('Group Request')).toBeInTheDocument()});
                await waitFor(() => {expect(screen.getByText('Teleport Request')).toBeInTheDocument()});
            });
        });
        test('Friend Request page', async () => {
            const requestsTab = screen.getByRole('tab', { name: /Requests/i });
            await userEvent.click(requestsTab);
            const friendRequestTab = screen.getByRole('tab', { name: /Friend Request/i });
            await userEvent.click(friendRequestTab);
            await waitFor(() => {expect(screen.getByText('No Friend Request')).toBeInTheDocument()});
        });
        test('Group Request page', async () => {
            const requestsTab = screen.getByRole('tab', { name: /Requests/i });
            await userEvent.click(requestsTab);
            const groupRequestTab = screen.getByRole('tab', { name: /Group Request/i });
            await userEvent.click(groupRequestTab);
            await waitFor(() => {expect(screen.getByText('No Group Request')).toBeInTheDocument()});
        });
        test('Teleport Request page', async () => {
            const requestsTab = screen.getByRole('tab', { name: /Requests/i });
            await userEvent.click(requestsTab);
            const teleportRequestTab = screen.getByRole('tab', { name: /Teleport Request/i });
            await userEvent.click(teleportRequestTab);
            await waitFor(() => {expect(screen.getByText('No Teleport Request')).toBeInTheDocument()});
        });
    });
    describe('Add Friend tab', () => {
        test('The tab is rendered', async () => {
            await waitFor(() => {expect(screen.getByRole('tab', { name: /Add/i })).toBeInTheDocument()});
        });
        describe('When clicked', () => {
            it('Goes to the Add Friend page, and the page renders', async () => {
                const addTab = screen.getByRole('tab', { name: 'Add Friend' });
                await userEvent.click(addTab);
                await waitFor(() => {expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument()});
                await waitFor(() => {expect(screen.getByText('Player ID')).toBeInTheDocument()});
            });
        });
    });
});
