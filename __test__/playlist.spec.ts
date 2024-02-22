import { PlaylistService } from '../src/Services/PlaylistService';
import { DatabaseAdapter } from '../src/Infra/External/Database/DatabaseAdapter';
import { UserService } from '../src/Services/UserService';
import { UserPresenterDTO } from '../src/DTO/UserPresenterDTO';
import { PlaylistPresenterDTO } from '../src/DTO/PlaylistPresenterDTO';

describe('Playlist', () => {
  let service: PlaylistService;
  let userService: UserService;
  
  service = new PlaylistService(new DatabaseAdapter());
  userService = new UserService(new DatabaseAdapter());

  let AUTHOR: UserPresenterDTO;
  let TARGET: UserPresenterDTO;
  let PLAYLIST: PlaylistPresenterDTO;

  it('should create fake infos for tests', async () => {

    let random: string;

    random = Math.random().toString(35)
    AUTHOR = await userService.register({
      email: `${random}@email.com`,
      password: '|3@6xQy£Wnm4',
      name: `${random}`,
      username: `${random}`,
    })

    random = Math.random().toString(35)
    TARGET = await userService.register({
      email: `${random}@email.com`,
      password: '|3@6xQy£Wnm4',
      name: `${random}`,
      username: `${random}`,
    })

  });

  it('should create a playlist', async () => {
    PLAYLIST = await service.create({
      authorId: AUTHOR.id,
      name: 'Test Playlist'
    })

    expect(PLAYLIST).toHaveProperty('id')
  })

  it('should add a contribuitor', async () => {
    expect(
      await service.addContributor(
        AUTHOR.id,
        TARGET.id,
        PLAYLIST.id
      )
    )
  });

  it('should remove a contribuitor', async () => {
    expect(
      await service.removeContributor(
        AUTHOR.id,
        TARGET.id,
        PLAYLIST.id
      )
    )
  });

  it('should delete a playlist', async () => {
    expect(
      await service.delete(
        AUTHOR.id, 
        PLAYLIST.id
      )
    )
  });

  it('should delete fake infos for tests', async () => {

    AUTHOR = await userService.delete(AUTHOR.id, AUTHOR.id)

    TARGET = await userService.delete(TARGET.id, TARGET.id)
    
  });

})