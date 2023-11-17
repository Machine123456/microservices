export type Validation = {
    regexString: string,
    errorMsg: string
}

export type FieldValidations = {
    fieldName: string,
    validations: Validation[]
};

export enum MappedAuthority {
    ROLE_USER = "ROLE_USER",
    ROLE_ADMIN = "ROLE_ADMIN",
  
    CREATE_USER = "CREATE_USER",
    READ_USER = "READ_USER",
    UPDATE_USER = "UPDATE_USER",
    DELETE_USER = "DELETE_USER",
  
    CREATE_ROLE = "CREATE_ROLE",
    READ_ROLE = "READ_ROLE",
    UPDATE_ROLE = "UPDATE_ROLE",
    DELETE_ROLE = "DELETE_ROLE",
  
    CREATE_Authority = "CREATE_AUTHORITY",
    READ_AUTHORITY = "READ_AUTHORITY",
    UPDATE_AUTHORITY = "UPDATE_AUTHORITY",
    DELETE_AUTHORITY = "DELETE_AUTHORITY"
  }
  


export type Authority = {
    id: number,
    authority: string
  }

export type Role = {
    id: number,
    name: string,
    authorities: Authority[]
  }

export type User = {
    id: number
    username: string,
    email: string,
    roles: Role[]
}

export type UserData = User & {
    hasError: boolean,
    errorMsg: string
  }