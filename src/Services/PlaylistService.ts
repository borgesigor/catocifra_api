import IDatabaseContext, { FindMany, FindUnique } from "../Shared/Context/IDatabaseContext";
import { Playlist } from "../Application/Entities/Playlist";
import { PlaylistRepository } from "../Application/Repository/PlaylistRepository";
import { UserService } from "./UserService";
import { ContributorAlreadyExists, AuthorDoesntHavePermission, PlaylistNotFound, UserNotFound, ContributorHasNonePlaylist, ContributorNotFound } from "../Shared/Handlers/Errors";
import { ContributorRepository } from "../Application/Repository/PlaylistContributorRepository";
import { PlaylistContributor } from "../Application/Entities/PlaylistContributor";
import { PlaylistPresenterDTO } from "../DTO/PlaylistPresenterDTO";
import { PermissionService, ServicePermissions } from "./PermissionService";
import { AuthService } from "./TokenService";

export class PlaylistService {
  private playlistRepository: PlaylistRepository;
  private contributorRepository: ContributorRepository;
  private userService: UserService;
  private permissionService: PermissionService;
  private authService: AuthService;

  constructor(database: IDatabaseContext) {
    this.playlistRepository = new PlaylistRepository(database);
    this.contributorRepository = new ContributorRepository(database);
    this.userService = new UserService(database);
    this.permissionService = new PermissionService(database)
    this.authService = new AuthService(database)
  }

  public async create(data: Playlist): Promise<PlaylistPresenterDTO> {

    try {

      if(!await this.userService.findById(data.authorId)) throw new UserNotFound();

      const playlist = await this.playlistRepository.create({
        ...data,
      });

      const playlistDTO: PlaylistPresenterDTO = {
        id: playlist.id,
        createdAt: playlist.createdAt,
        name: playlist.name,
        authorId: playlist.authorId,
      }

      return playlistDTO;

    } catch (err) {
      throw err;
    }

  }

  private async visibilityMiddleware(token: string, playlistId: string): Promise<boolean> {

    const playlist = await this.playlistRepository.findUnique({
      where: {
        id: playlistId
      }
    });

    if(playlist.visibility === 'PRIVATE') throw new PlaylistNotFound();
    
  }

}