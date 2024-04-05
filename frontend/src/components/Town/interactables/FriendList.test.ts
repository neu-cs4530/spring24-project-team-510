import * as api from './api'; // replace './api' with our actual file

jest.mock('./api');

// mock the player and some friends for testing
api.player = { name: 'Player', status: 'Online', location: { x: 0, y: 0 }};
const friend1 = { name: 'Friend1', status: 'Online', location: { x: 1, y: 1 }};

describe('FriendList', () => {
    beforeEach(() => {
        // Reset mock implementations and state before each test
        jest.clearAllMocks();
        api.teleportCooldown.mockReturnValue(0); // Default to no cooldown for most tests
        api.player.location.mockReturnValue('CurrentLocation'); // Mock current location
        api.teleportPermission.mockResolvedValue(true); // Default to permission granted
      });
    
      test('The player cannot teleport during cooldown', () => {
        api.teleportCooldown.mockReturnValue(10); // Override cooldown for this test
        expect(api.canTeleport()).toBe(false);
      });
    
      test('The player teleports to a friend if the friend accepts the request', async () => {
        const friend1 = { location: 'Friend1Location' };
        api.canTeleport.mockReturnValue(true);
        api.teleportPermission.mockResolvedValue(true);
        await api.player.teleport('Friend1'); // Simulate teleporting
        expect(api.player.location()).toEqual(friend1.location);
      });
});