import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { envs } from "./envs";

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {

    static generateToken(payLoad: object,duration: SignOptions["expiresIn"] = "2h",): Promise<string | null> {
        return new Promise((resolve) => {
            jwt.sign(payLoad, JWT_SEED, { expiresIn: duration }, (err, token) => {
                if (err || !token) return resolve(null);

                resolve(token);
            });
        });
    }

    static validateToken<T>(token: string):Promise<T|null>{


        return new Promise((resolve)=>{
            jwt.verify(token,JWT_SEED,(err,decoded)=>{
            
            
                if(err) return resolve(null);

                resolve(decoded as T);
            })
        });
    }
}