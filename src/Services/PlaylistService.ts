import IDatabaseContext, { FindMany, FindUnique } from "../Shared/Context/IDatabaseContext";
import { Playlist } from "../Application/Entities/Playlist";
import { PlaylistRepository } from "../Application/Repository/PlaylistRepository";
import { UserService } from "./UserService";
import { ContributorAlreadyExists, AuthorDoesntHavePermission, PlaylistNotFound, UserNotFound, ContributorNotFound } from "../Shared/Handlers/Errors";
import { ContributorRepository } from "../Application/Repository/PlaylistContributorRepository";
import { PlaylistContributor } from "../Application/Entities/PlaylistContributor";
import { PlaylistPresenterDTO } from "../DTO/PlaylistPresenterDTO";
import { PermissionService, ServicePermissions } from "./PermissionService";
import { getIdFromToken } from "../Shared/Helpers/Token";

export class PlaylistService {
  private playlistRepository: PlaylistRepository;
  private contributorRepository: ContributorRepository;
  private userService: UserService;
  private permissionService: PermissionService;

  constructor(database: IDatabaseContext) {
    this.playlistRepository = new PlaylistRepository(database);
    this.contributorRepository = new ContributorRepository(database);
    this.userService = new UserService(database);
    this.permissionService = new PermissionService(database)
  }

  private mapPlaylistToDTO(playlist: Playlist): PlaylistPresenterDTO {
    return {
      id: playlist.id,
      createdAt: playlist.createdAt,
      name: playlist.name,
      authorId: playlist.authorId,
    };
  }

  public async create(data: Playlist): Promise<PlaylistPresenterDTO> {

    if(!await this.userService.findById(data.authorId)) throw new UserNotFound();

    const playlist = await this.playlistRepository.create({
      ...data,
    });

    return this.mapPlaylistToDTO(playlist);
  }

  private async visibilityMiddleware(token: string, playlistId: string): Promise<boolean> {
    const playlist = await this.playlistRepository.findUnique({
      where: {
        id: playlistId
      }
    });

    const privatePlaylist = playlist.visibility === 'PRIVATE'

    if(privatePlaylist && !await this.contributorMiddleware(token, playlistId)) throw new PlaylistNotFound();

    return true;
  }

  private async contributorMiddleware(token: string, playlistId: string): Promise<boolean> {
    const id = getIdFromToken(token);

    await this.userService.findById(id)

    const contributor = await this.contributorRepository.findUnique({
      where: {
        playlistId: playlistId,
        userId: id
      }
    });

    const author = await this.playlistRepository.findUnique({
      where: {
        id: playlistId,
        authorId: id
      }
    });

    if(!contributor && !author) throw new ContributorNotFound();

    return true;
  }

}