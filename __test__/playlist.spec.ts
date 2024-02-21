import { PlaylistService } from '../src/Services/PlaylistService';
import { DatabaseAdapter } from '../src/Infra/External/Database/DatabaseAdapter';

describe('Playlist', () => {
  let service: PlaylistService;

  beforeEach(() => {
    service = new PlaylistService(new DatabaseAdapter());
  });

  it('should create a new playlist', async () => {
    expect(
      await service.create(
        '8f48fb7e-a095-4c66-912a-9f637b803600', 
        {
          name: 'My Playlist',
        }
      )
    )
  });

  it('should add a contritubor', async () => {
    expect(
      await service.addContributor(
        '8f48fb7e-a095-4c66-912a-9f637b803600', 
        'd8aa7ed3-a056-48d8-924a-9f60b9e2d97b',
        '9b0a4c04-2b1d-48a9-8ed2-a916cc9747fc'
      )
    )
  });

  it('should remove a contritubor', async () => {
    expect(
      await service.removeContributor(
        '8f48fb7e-a095-4c66-912a-9f637b803600', 
        'd8aa7ed3-a056-48d8-924a-9f60b9e2d97b',
        '9b0a4c04-2b1d-48a9-8ed2-a916cc9747fc'
      )
    )
  });

})