export class UnexpectedError extends Error{
  private fullMessage: object
  private httpErrorCode: number
  
  constructor(err: any){
    console.log(`[ERRO] ${err}`)
    super("Ocorreu um erro interno inesperado")
    this.name = "UNEXPECTED_ERROR"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 500
  }
}

export class PasswordDoesntMatch extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Senha não confere")
    this.name = "PASSWORD_DOESNT_MATCH"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 401
  }
}

// Invalid Data Errors

export class InvalidToken extends Error{
  private fullMessage: object
  private httpErrorCode: number = 401;

  constructor(){
    super("Token inválido")
    this.name = "INVALID_TOKEN"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 401
  }
}

export class InvalidEmail extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(msg: string){
    super("Email inválido: "+ msg)
    this.name = "INVALID_EMAIL"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 422
  }
}

export class InvalidPassword extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Senha inválida")
    this.name = "INVALID_PASSWORD"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 422
  }
}

export class InvalidUsername extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(msg: string){
    super("Username inválido: " + msg)
    this.name = "INVALID_USERNAME"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 422
  }
}

export class InvalidFileType extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(msg: string){
    super("Tipo de arquivo inválido: " + msg)
    this.name = "INVALID_FILE_TYPE"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 422
  }
}

// Unauthorized Errors

export class WrongCredentials extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Credenciais erradas.")
    this.name = "WRONG_CREDENTIALS"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 401
  }
}

export class AuthorDoesntHavePermission extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Autor não tem permissão")
    this.name = "AUTHOR_DOESNT_HAVE_PERMISSION"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 403
  }
}

// Already Exists Errors

export class ContributorAlreadyExists extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Contribuidor já existe.")
    this.name = "CONTRIBUTOR_ALREADY_EXISTS"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 409
  }
}

export class UserAlreadyExists extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Usuário já existe.")
    this.name = "USER_ALREADY_EXISTS"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 409
  }
}

export class UsernameAlreadyExists extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(msg: string){
    super("Esse username já está cadastrado: "+ msg)
    this.name = "USERNAME_ALREADY_CADASTRED"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 409
  }
}

export class EmailAlreadyExists extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(msg: string){
    super("Esse email já está cadastrado: "+ msg)
    this.name = "EMAIL_ALREADY_CADASTRED"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 409
  }
}

// Not Found Errors

export class UserNotFound extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Usuário não encontrado")
    this.name = "USER_NOT_FOUND"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 404
  }
}

export class PermissionNotFound extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Permissão não encontrada")
    this.name = "PERMISSION_NOT_FOUND"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 404
  }
}

export class PlaylistNotFound extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Playlist não encontrada.")
    this.name = "PLAYLIST_NOT_FOUND"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 404
  }
}

export class ContributorNotFound extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Contribuidor não encontrado.")
    this.name = "CONTRIBUTOR_NOT_FOUND"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 404
  }
}