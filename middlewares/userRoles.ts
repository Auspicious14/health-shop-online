import { Request, Response, NextFunction } from "express";

const verifyRoles = (authRoles?: number[]) => {
  return (req: any, res: any, next: NextFunction) => {
    try {
      if (!req.roles)
        return res.sendStatus(401).json({ error: "Unauthorised" });
      const roles = req.roles
        .map((role: number) => authRoles?.includes(role))
        .find((rol: boolean) => rol === true);
      if (!roles) return res.sendStatus(401);
      next();
    } catch (error) {
      next(error);
    }
  };
};

// export const allowLogIn = (req: Request, res: Request, next: NextFunction) => {
//   try {
//     const user = res.locals.loggedInUser;
//     if (!user) return res.sendStatus(401).json({ error: `we don't ` });
//     req.user = user;
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

export default verifyRoles;
