import e from "express";
import User from "../models/user.model";

export type AsyncRequestHandler = (
  req: e.Request & { user?: InstanceType<typeof User> },
  res: e.Response,
  next: e.NextFunction
) => Promise<any>;
