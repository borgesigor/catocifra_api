import { PasswordCheckService, PasswordCheckStrength } from './PasswordChecker';

export function isEmailValid(email: string): boolean{
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return (email !== '' && email.match(emailFormat)) ? true : false
}

export function isPasswordValid(password: string): boolean{
  const check: PasswordCheckStrength = new PasswordCheckService().checkPasswordStrength(password)  
  return (check == 2 || check == 3 || check == 4) ? true : false
}