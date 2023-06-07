interface User {
    id: number;
    firstName: string;
    lastName: string;
    phone: number;
    country: string;
    email: string;
    password: string;
    authToken?: string;
    status: string;
    role: string[];
    created_at: string;
    updated_at: string;
    userID: number;
}


const GUESS: User = {
    firstName: '',
    lastName: '',
    country: '',
    phone: 1234567890,
    email: '',
    password: '',
    created_at: '',
    updated_at: '',
    role: [],
    status: '',
    userID: 0 ,
    authToken: '',
    id: 0
  }

  export {
    User,
    GUESS
  }