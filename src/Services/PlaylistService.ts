import IDatabaseContext, { FindMany } from "../Shared/Context/IDatabaseContext";
import { Playlist } from "../Application/Entities/Playlist";
import { User } from "../Application/Entities/User";
import { PlaylistRepository } from "../Application/Repository/PlaylistRepository";
import { UserService } from "./UserService";
import { ContributorAlreadyExists, DoesntHavePermission, PlaylistNotFound, UserNotFound } from "../Shared/Handlers/Errors";
import { ContributorRepository } from "../Application/Repository/PlaylistContributorRepository";
import { PlaylistContributor } from "../Application/Entities/PlaylistContributor";

export class PlaylistService {
  private playlistRepository: PlaylistRepository;
  private contributorRepository: ContributorRepository;
  private userService: UserService;

  constructor(database: IDatabaseContext) {
    this.playlistRepository = new PlaylistRepository(database);
    this.contributorRepository = new ContributorRepository(database);
    this.userService = new UserService(database);
  }

  public async create(authorId: string, playlist: Playlist): Promise<Playlist> {
    try {

      if(!await this.userService.findById(authorId)) throw new UserNotFound();

      const createPlaylist = await this.playlistRepository.create({
        authorId: authorId,
        ...playlist,
      });

      return createPlaylist

    } catch (err) {
      throw err;
    }
  }

  public async findById(id: string): Promise<Playlist> {
    try {

      return await this.playlistRepository.findUnique({
        where: {
          id
        }
      })

    } catch (err) {
      throw err;
    }
  }

  public async findManyByAuthorId(authorId: string): Promise<Playlist[]> {
    try {

      return await this.playlistRepository.findMany({
        where: {
          authorId
        }
      })

    } catch (err) {
      throw err;
    }
  }

  public async checkIsContributor(userId: string, playlistId: string): Promise<boolean> {
    try {

      const itIsAuthorInPlaylist = await this.playlistRepository.findUnique({
        where: {
          authorId: userId,
        }
      })
      const hasContributor = await this.findContributor(playlistId, userId)

      if(itIsAuthorInPlaylist) return true;

      return hasContributor && hasContributor.userId === userId;

    } catch (err) {
      throw err;
    }
  }

  async findManyContributors(playlistId: string, args: FindMany<PlaylistContributor>): Promise<PlaylistContributor[]> {

    return await this.contributorRepository.findMany({
      take: args.take,
      skip: args.skip,
      order: args.order,
      where: {
        ...args.where,
        playlistId: playlistId
      }
    })

  }

  async findContributor(playlistId: string, userId: string): Promise<PlaylistContributor> {

    return await this.contributorRepository.findUnique({
      where: {
        playlistId: playlistId,
        userId: userId
      }
    })

  }
  
  public async addContributor(authorId: string, targetId: string, playlistId: string): Promise<any> {
    try {

      if(!await this.findById(playlistId)) throw new PlaylistNotFound();

      const hasPermission = await this.userService.hasPermission(authorId, 'modify_contributors');

      if(!hasPermission && !await this.checkIsContributor(authorId, playlistId)) throw new DoesntHavePermission();

      if(!await this.userService.findById(targetId)) throw new UserNotFound();

      if(await this.checkIsContributor(targetId, playlistId)) throw new ContributorAlreadyExists();

      return await this.contributorRepository.create({
        playlistId: playlistId,
        userId: targetId
      })

    } catch (err) {
      throw err;
    }

  }

  public async removeContributor(authorId: string, targetId: string, playlistId: string): Promise<PlaylistContributor> {
    try {

      if(!await this.findById(playlistId)) throw new PlaylistNotFound();

      const hasPermission = await this.userService.hasPermission(authorId, 'modify_contributors');

      if(!hasPermission && !await this.checkIsContributor(authorId, playlistId)) throw new DoesntHavePermission();

      if(!await this.userService.findById(targetId)) throw new UserNotFound();

      const targetContributor = await this.findContributor(playlistId, targetId)

      if(!targetContributor) throw new UserNotFound();

      return await this.contributorRepository.delete({ 
        userId: targetContributor.userId as string, 
        playlistId: targetContributor.playlistId as string 
      })

    } catch (err) {
      throw err;
    }
  }

}