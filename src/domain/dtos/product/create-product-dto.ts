import { Validators } from "../../../config/validators";

export class CreateProductDto{


    private constructor(
        public readonly name:string,
        public readonly available:boolean,
        public readonly price:number,
        public readonly user:string,
        public readonly category:string
    ){}

    static create(object:{[key:string]:any}):[string?,CreateProductDto?]{
        const{name,available,price,user,category}=object;

        if(!Validators.isMongoId(user)) return ["Invalid User Id"];
        if(!Validators.isMongoId(category)) return ["Invalid Category Id"];
        if(!name) return ["Missing name"];
        if(!user) return ["missin user"];
        if(!category) return ["missin category"];


        return [
            undefined,new CreateProductDto(name,!!available,price,user,category)
        ]
    }

}