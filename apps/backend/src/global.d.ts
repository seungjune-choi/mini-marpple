declare namespace Express {
  export interface Request {
    session: any;
    user?: any;
  }
}
