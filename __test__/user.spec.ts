import { UserService } from '../src/Services/UserService'
import { DatabaseAdapter } from '../src/Infra/External/Database/DatabaseAdapter';
import { UserPresenterDTO } from '../src/DTO/UserPresenterDTO';

describe('User', () => {
  let service: UserService;

  service = new UserService(new DatabaseAdapter());

  let ADMIN: UserPresenterDTO;
  let USER: UserPresenterDTO;

  it('should register a new fake admin user for tests', async () => {

    let random = Math.random().toString(35)

    ADMIN = await service.register({
      email: `${random}@email.com`,
      password: '|3@6xQy£Wnm4',
      name: `${random}`,
      username: `${random}`,
    })

    // please create manually this user in your database = 'fake_admin_for_database_mock'
    await service.addPermission('fake_admin_for_database_mock', ADMIN.id, 'add_permission')

    expect(ADMIN).toHaveProperty('id');

  });

  it('should register a new user', async () => {

    let random = Math.random().toString(35)

    USER = await service.register({
      email: `${random}@gmail.com`,
      password: 'teste1234',
      name: 'Igor',
      username: random,
    })

    expect(USER).toHaveProperty('id');

  });

  it('should find this user', async () => {

    const find = await service.findById(USER.id)

    expect(find);

  });

  it('should user has add_permission permission', async () => {
      
    const result = await service.hasPermission(
      ADMIN.id,
      'add_permission'
    )

    expect(result).toBe(true);

  });

  it('should add permission to a user', async () => {
      
    const result = await service.addPermission(
      ADMIN.id, 
      USER.id, 
      'list_all_users'
    )

    expect(result).toHaveProperty('id');

  });
  
  it('should find many users', async () => {

    const find = await service.findMany(
      USER.id,
      {
        where: {
          name: 'Updater'
        }
      }
    )

    expect(find);

  });

  it('should update a user name', async () => {

    const result = await service.updateName(
      USER.id,
      USER.id,
      'The Beatles'
    )

    expect(result).toHaveProperty('id');

  });

  it('should update a user email', async () => {

    const result = await service.updateEmail(
      USER.id,
      USER.id,
      'updated@updated.com'
    )

    expect(result).toHaveProperty('id');

  });

  it('should update a user password', async () => {

    const result = await service.updatePassword(
      USER.id,
      USER.id,
      'randomPassword#5432'
    )

    expect(result).toHaveProperty('id');

  });

  it('should delete a user', async () => {

    const delete_ = await service.delete(USER.id, USER.id)

    expect(delete_).toHaveProperty('id');

  });

  it('should delete a fake admin user for tests', async () => {

    ADMIN = await service.delete(ADMIN.id, ADMIN.id)

    expect(ADMIN).toHaveProperty('id');

  });

});
