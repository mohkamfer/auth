import { NextFunction, Request, Response } from "express";
import validator from "validator"
import { hashPassword, titleCase } from "./util";

export async function validateUser(request: Request, response: Response, next: NextFunction) {
  let errorMessage: string = "User not saved."
  let valid: boolean = true
  const name = request.body.name
  const email = request.body.email
  const password = request.body.password
  if (!name) {
    errorMessage += " Request body missing the name."
    valid = false
  } else {
    if (validator.isEmpty(name)) {
      errorMessage += " Name cannot be empty."
      valid = false
    }
  }

  if (!email) {
    errorMessage += " Request body missing the email."
    valid = false
  } else {
    if (validator.isEmpty(email)) {
      errorMessage += " Email cannot be empty."
      valid = false
    }

    if (!validator.isEmail(email)) {
      errorMessage += " Not a valid email."
      valid = false
    }
  }

  if (!password) {
    errorMessage += " Request body missing the password."
    valid = false
  } else {
    if (validator.isEmpty(password)) {
      errorMessage += " Password cannot be empty."
      valid = false
    }

    if (password.length < 6 || password.length > 12) {
      errorMessage += " Password must be between 6 and 12 characters."
      valid = false
    }
  }

  if (!valid)
    response.status(400).json({ error: errorMessage })
  else {
    const normalizedName = titleCase(name).trim()
    request.body.name = normalizedName
    const hashedPassword = hashPassword(password)
    request.body.password = hashedPassword
  }

  return valid
}

export async function validatePermission(request: Request, response: Response, next: NextFunction) {
  let errorMessage: string = "Permission not saved."
  let valid: boolean = true
  const name: string = request.body.name
  if (!name) {
    errorMessage += " Request body missing the name."
    valid = false
  } else {
    if (validator.isEmpty(name)) {
      errorMessage += " Name cannot be empty."
      valid = false
    }
  }

  if (!valid)
    response.status(400).json({ error: errorMessage })
  else {
    const normalizedName = name.replace(" ", "_").toUpperCase().trim() // convert to all caps as naming convention
    request.body.name = normalizedName
  }

  return valid
}

export async function validateRole(request: Request, response: Response, next: NextFunction) {
  let errorMessage: string = "Role not saved."
  let valid: boolean = true
  const name: string = request.body.name
  if (!name) {
    errorMessage += " Request body missing the name."
    valid = false
  } else {
    if (validator.isEmpty(name)) {
      errorMessage += " Name cannot be empty."
      valid = false
    }
  }

  if (!valid)
    response.status(400).json({ error: errorMessage })
  else {
    const normalizedName = name.replace(" ", "_").toUpperCase().trim() // convert to all caps as naming convention
    request.body.name = normalizedName
  }

  return valid
}
