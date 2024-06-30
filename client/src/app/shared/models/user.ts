export interface User {
  readonly id: number
  email: string
  name: string
  admin: string
  token: string;
  avatar?: string
}

export interface Address {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
}

export interface Response<User> {
  user?: User
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
  flash?: [message_type: string, message: string]
  error?: string[]
}
