import { UserService } from '../src/Services/UserService'
import { DatabaseAdapter } from '../src/Infra/External/Database/DatabaseAdapter';
import { User } from '../src/Application/Entities/User';
import { UserPresenterDTO } from '../src/DTO/UserPresenterDTO';

let testUser: UserPresenterDTO | null = null;

describe('User', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(new DatabaseAdapter());
  });

  it('should register a new user', async () => {

    const register = await service.register({
      email: 'test@gmail.com',
      password: 'teste1234',
      name: 'Igor',
      username: 'igordev',
    })

    register ? testUser = register : testUser = null;

    expect(register).toHaveProperty('id');

  });

  it('should find this user', async () => {

    const find = await service.findById(testUser?.id as string)

    expect(find);

  });
  
  it('should find many users', async () => {

    const find = await service.findMany(
      '8f48fb7e-a095-4c66-912a-9f637b803600', 
      {
        where: {
          name: 'Updater'
        }
      }
    )

    expect(find);

  });

  it('should verify if user has admin permission', async () => {

    const hasPermission = await service.hasPermission(testUser?.id as string, 'admin')

    expect(hasPermission).toBe(false);

  });

  it('should update a user', async () => {

    await service.updateName(
      testUser?.id as string, 
      testUser?.id as string, 
      'The Beatles'
    )

    await service.updateEmail(
      testUser?.id as string, 
      testUser?.id as string, 
      `${testUser?.id}@gmail.com`
    )

    const update = await service.updatePassword(
      testUser?.id as string, 
      testUser?.id as string, 
      'atualização de senha'
    )

    expect(update).toHaveProperty('email', `${testUser?.id}@gmail.com`);

  });

  it('should delete a user', async () => {

    const delete_ = await service.delete(testUser?.id as string, testUser?.id as string)

    expect(delete_).toHaveProperty('id');

  });

});
