export interface IUser {
    id: number;
    username: string;
    email: string;
}

interface IConnection {
    email: string;
    refreshToken: string;
    connectedAt: string;
  }
  