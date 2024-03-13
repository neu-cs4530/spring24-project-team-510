import { nanoid } from 'nanoid';
import { Player as PlayerModel, PlayerLocation, TownEmitter } from '../types/CoveyTownSocket';

/**
 * Each user who is connected to a town is represented by a Player object
 */
export default class Player {
  /** The current location of this user in the world map * */
  public location: PlayerLocation;

  /** The unique identifier for this player * */
  private readonly _id: string;

  /** The player's username, which is not guaranteed to be unique within the town * */
  private readonly _userName: string;

  /** The secret token that allows this client to access our Covey.Town service for this town * */
  private readonly _sessionToken: string;

  /** The secret token that allows this client to access our video resources for this town * */
  private _videoToken?: string;

  /** A special town emitter that will emit events to the entire town BUT NOT to this player */
  public readonly townEmitter: TownEmitter;

  /** The player's list of friends, stored as player ids */
  private _friendsList: string[] = [];

  constructor(userName: string, townEmitter: TownEmitter) {
    this.location = {
      x: 0,
      y: 0,
      moving: false,
      rotation: 'front',
    };
    this._userName = userName;
    // change this to be a unique id for each player pulled from the database
    this._id = nanoid();
    this._sessionToken = nanoid();
    this.townEmitter = townEmitter;
    // get friends list from database
    // this._friendsList = getFriendsListFromDatabase(this._id);
  }

  get userName(): string {
    return this._userName;
  }

  get id(): string {
    return this._id;
  }

  set videoToken(value: string | undefined) {
    this._videoToken = value;
  }

  get videoToken(): string | undefined {
    return this._videoToken;
  }

  get sessionToken(): string {
    return this._sessionToken;
  }

  get friendsList(): string[] {
    return this._friendsList;
  }

  addFriend(playerId: string): void {
    this._friendsList.push(playerId);
  }

  removeFriend(playerId: string): void {
    this._friendsList = this._friendsList.filter(id => id !== playerId);
  }

  toPlayerModel(): PlayerModel {
    return {
      id: this._id,
      location: this.location,
      userName: this._userName,
    };
  }
}
