export const enum PasswordCheckStrength {
  Short,
  Common,
  Weak,
  Ok,
  Strong,
};

export class PasswordCheckService {
  public static get MinimumLength(): number {
    return 5;
  }

  private commonPasswordPatterns = /passw.*|12345.*|09876.*|qwert.*|asdfg.*|zxcvb.*|footb.*|baseb.*|drago.*/;

  public isPasswordCommon(password: string): boolean {
    return this.commonPasswordPatterns.test(password);
  }

  public checkPasswordStrength(password: string): PasswordCheckStrength {
    let numberOfElements = 0;
    numberOfElements = /.*[a-z].*/.test(password) ? ++numberOfElements : numberOfElements;
    numberOfElements = /.*[A-Z].*/.test(password) ? ++numberOfElements : numberOfElements;
    numberOfElements = /.*[0-9].*/.test(password) ? ++numberOfElements : numberOfElements;
    numberOfElements = /[^a-zA-Z0-9]/.test(password) ? ++numberOfElements : numberOfElements;

    let currentPasswordStrength = PasswordCheckStrength.Short;

    if (password === null || password.length < PasswordCheckService.MinimumLength) {
      currentPasswordStrength = PasswordCheckStrength.Short;
    } else if (this.isPasswordCommon(password) === true) {
      currentPasswordStrength = PasswordCheckStrength.Common;
    } else if (numberOfElements === 0 || numberOfElements === 1 || numberOfElements === 2) {
      currentPasswordStrength = PasswordCheckStrength.Weak;
    } else if (numberOfElements === 3) {
      currentPasswordStrength = PasswordCheckStrength.Ok;
    } else {
      currentPasswordStrength = PasswordCheckStrength.Strong;
    }

    return currentPasswordStrength;
  }
}