import { bcrypAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user-dto";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user-dto";
import { UserEntity } from "../../domain/entities/user-entity";
import { EmailService } from "./email-service";


export class AuthService{
    constructor(
        private readonly emailService:EmailService,
    ){}

    public async registerUser(registerUserDto:RegisterUserDto){

        const existUser = await UserModel.findOne({email:registerUserDto.email});

        if(existUser) throw CustomError.badRequest("Email already exist");


        try{

            const user = new UserModel(registerUserDto);
            

            //Encriptar la contraseña
            user.password=bcrypAdapter.hash(registerUserDto.password);
            await user.save();


            //JWT
            const token = await JwtAdapter.generateToken({id:user.id});
            if(!token) throw CustomError.internalServerError("Error while creating JWT");

            //Email de confirmacion
            
            await this.sendEmailValidationLink(user.email);

            const {password,...userEntity} = UserEntity.fromObject(user);

            return {
                userEntity,
                token:token
            };
        }catch(error){
            throw CustomError.internalServerError(`${error}`);
        }

    }

    public async loginUser(loginUserDto:LoginUserDto){

        
        const user = await UserModel.findOne({
            email:loginUserDto.email
        });

        if(!user) throw CustomError.badRequest("Email not exist");


        //Si concuerda la contraseña
        const isMatch = bcrypAdapter.compare(loginUserDto.password,user.password);
        if(!isMatch) throw CustomError.badRequest("Password is not valid");

        const {password,...userEntity} = UserEntity.fromObject(user);

        const token = await JwtAdapter.generateToken({id:user.id});
        if(!token) throw CustomError.internalServerError("Error while creating JWT");

        //Retornar el usuario con el token
        return{
            user:userEntity,
            token:token
        }
    }



    public validateEmail = async(token:string)=>{
        const payLoad = await JwtAdapter.validateToken(token);
        if(!payLoad) throw CustomError.unauthorized("Invalid token");

        const {email} =payLoad as {email:string};

        if(!email) throw CustomError.internalServerError("Email not in token");

        const user = await UserModel.findOne({email});
        if(!user) throw CustomError.internalServerError("Email not exist");

        user.emailValidated = true;
        await user.save();

        return true;
    }

    private sendEmailValidationLink = async (email:string)=>{
        const token = await JwtAdapter.generateToken({email});
        if(!token) throw CustomError.internalServerError("Error gretting token");

        const link =`${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html=`
            <h1>Validate your Emil</h1>
            <p>Click on the following link to validate your email</p>
            <a href="${link}">Validate your email: ${email}</a>
        `;

        const options = {
            to:email,
            subject:"Validate your email",
            htmlBody:html
        }

        const isSet = await this.emailService.sendEmail(options);
        if(!isSet) throw CustomError.internalServerError("Error sending email");

        return true;
    }
}

