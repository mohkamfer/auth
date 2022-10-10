const bcrypt = require("bcryptjs")

export function titleCase(string): string {
  var splitStr = string.split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }

  return splitStr.join(' ');
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function correctPassword(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword)
}

export function validNumber(str): boolean {
  return /^\+?(\d+)$/.test(str);
}
