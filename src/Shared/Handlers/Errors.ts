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

export class MissingArguments extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(args: string){
    super("Estão faltando argumentos: "+ args)
    this.name = "MISSING_ARGUMENTS"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 400
  }
}

export class NotFound extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Não foi encontrado nenhum resultado.")
    this.name = "NOT_FOUND"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 404
  }
}

export class InvalidArgument extends Error{
  private fullMessage: object
  private httpErrorCode: number = 422;

  constructor(args: string){
    super("Argumento inválido: "+ args)
    this.name = "INVALID_ARGUMENT"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 422
  }
}

export class AlreadyExists extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Isso já existe.")
    this.name = "ALREADY_EXISTS"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 409
  }
}

export class EmailAlreadyCadastred extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Esse email já está cadastrado.")
    this.name = "EMAIL_ALREADY_CADASTRED"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 409
  }
}

export class InvalidEmail extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Email inválido.")
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
    super("Senha inválida.")
    this.name = "INVALID_PASSWORD"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 422
  }
}

export class UserNotFound extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Usuário não encontrado.")
    this.name = "USER_NOT_FOUND"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 404
  }
}

export class InvalidFileType extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Tipo de arquivo inválido.")
    this.name = "INVALID_FILE_TYPE"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 422
  }
}

export class DoesntHavePermission extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Você não tem permissão para fazer isso.")
    this.name = "DOESNT_HAVE_PERMISSION"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 403
  }
}

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

export class ContributorMustHaveAPlaylistOrTablatureID extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Contribuidor deve ter uma playlist ou uma tablatura.")
    this.name = "CONTRIBUTOR_MUST_HAVE_A_PLAYLIST_OR_TABLATURE_ID"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 422
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