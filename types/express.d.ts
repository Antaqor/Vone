declare module 'express' {
  interface Request<P = any, ResBody = any, ReqBody = any, ReqQuery = any> {
    params: P;
    body: ReqBody;
    query: ReqQuery;
    headers: any;
    [key: string]: any;
  }

  interface Response<ResBody = any> {
    status(code: number): this;
    json(body: ResBody): this;
    [key: string]: any;
  }

  type NextFunction = (err?: any) => void;

  const express: any;

  export { Request, Response, NextFunction };
  export default express;
}
