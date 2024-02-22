import IDatabaseContext, { FindMany } from "../Shared/Context/IDatabaseContext";
import { Playlist } from "../Application/Entities/Playlist";
import { PlaylistRepository } from "../Application/Repository/PlaylistRepository";
import { UserService } from "./UserService";
import { ContributorAlreadyExists, DoesntHavePermission, PlaylistNotFound, UserNotFound } from "../Shared/Handlers/Errors";
import { ContributorRepository } from "../Application/Repository/PlaylistContributorRepository";
import { PlaylistContributor } from "../Application/Entities/PlaylistContributor";
import { PlaylistPresenterDTO } from "../DTO/PlaylistPresenterDTO";

export class PlaylistService {
  private playlistRepository: PlaylistRepository;
  private contributorRepository: ContributorRepository;
  private userService: UserService;

  constructor(database: IDatabaseContext) {
    this.playlistRepository = new PlaylistRepository(database);
    this.contributorRepository = new ContributorRepository(database);
    this.userService = new UserService(database);
  }

  public async create(playlist: Playlist): Promise<PlaylistPresenterDTO> {

    try {

      if(!await this.userService.findById(playlist.authorId)) throw new UserNotFound();

      const createPlaylist = await this.playlistRepository.create({
        ...playlist,
      });

      return {
        id: createPlaylist.id as string,
        createdAt: createPlaylist.createdAt as Date,
        name: createPlaylist.name,
        authorId: createPlaylist.authorId,
      }

    } catch (err) {
      throw err;
    }

  }

  public async findById(id: string): Promise<PlaylistPresenterDTO> {

    try {

      const result =  await this.playlistRepository.findUnique({
        where: {
          id
        }
      })

      return {
        id: result.id as string,
        createdAt: result.createdAt as Date,
        name: result.name,
        authorId: result.authorId,
      }

    } catch (err) {
      throw err;
    }

  }

  public async findManyByAuthorId(authorId: string): Promise<PlaylistPresenterDTO[]> {

    try {

      const result = await this.playlistRepository.findMany({
        where: {
          authorId
        }
      })

      return result.map(result => ({
        id: result.id as string,
        createdAt: result.createdAt as Date,
        name: result.name,
        authorId: result.authorId,
      }))

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
  
  public async addContributor(authorId: string, targetId: string, playlistId: string): Promise<PlaylistContributor> {

    try {

      if(!await this.findById(playlistId)) throw new PlaylistNotFound();

      if(
        !await this.userService.hasPermission(authorId, 'modify_contributors') &&
        !await this.checkIsContributor(authorId, playlistId)
      ) throw new DoesntHavePermission();

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

      if(
        !await this.userService.hasPermission(authorId, 'modify_contributors') &&
        !await this.checkIsContributor(authorId, playlistId)
      ) throw new DoesntHavePermission();

      if(!await this.userService.findById(targetId)) throw new UserNotFound();

      const targetContributor = await this.findContributor(playlistId, targetId)

      if(!targetContributor) throw new UserNotFound();

      return await this.contributorRepository.delete({ 
        where: {
          userId: targetContributor.userId as string, 
          playlistId: targetContributor.playlistId as string 
        }
      })

    } catch (err) {
      throw err;
    }

  }

  public async delete(authorId: string, playlistId: string): Promise<PlaylistPresenterDTO>{

    try {

      if(!await this.findById(playlistId)) throw new PlaylistNotFound();

      if(
        !await this.userService.hasPermission(authorId, 'modify_contributors') &&
        !await this.checkIsContributor(authorId, playlistId)
      ) throw new DoesntHavePermission();

      await this.contributorRepository.delete({ 
        where: {
          playlistId: playlistId
        }
      })

      const result = await this.playlistRepository.delete({ 
        where: {
          id: playlistId
        }
      });

      return {
        id: result.id as string,
        createdAt: result.createdAt as Date,
        name: result.name,
        authorId: result.authorId,
      }

    } catch (err) {
      throw err;
    }
  }

}