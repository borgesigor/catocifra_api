import { TokenService } from '../src/Services/TokenService';

describe('Token', () => {

  it('should create a token', async () => {

    const tokenService = new TokenService()

    const test = tokenService.sign({ id: 'teste' }, { expiresIn: '1h' })

    expect(test)

  });

})