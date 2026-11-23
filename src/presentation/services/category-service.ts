import { CategoryModel } from "../../data";
import { CustomError } from "../../domain";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category-dto";
import { PaginationDto } from "../../domain/dtos/shared/pagination-dto";
import { UserEntity } from "../../domain/entities/user-entity";


export class CategoryService{


    constructor(){}


    async createCategory(createCategoryDto:CreateCategoryDto,user:UserEntity){
        
        const categoryExist = await CategoryModel.findOne({name:createCategoryDto.name});
        if(categoryExist) throw CustomError.badRequest("Category already exist");

        try{
            const category = new CategoryModel({
                ...createCategoryDto,
                user:user.id
            })

            await category.save();

            return{
                id:category.id,
                name:category.name,
                available:category.available
            }

        }catch(error){
            throw CustomError.internalServerError("Internal server error");
        }
    }

    async getCateories(paginationDto:PaginationDto){

        const {page,limit} = paginationDto;

        try{    

            const [total,categories] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find().skip((page-1) * limit).limit(limit)
            ])

            return{
                page:page,
                limit:limit,
                total:total,
                categories:categories.map(category=>({
                id:category.id,
                name:category.name,
                available:category.available}))
            }
        }catch(error){
            throw CustomError.internalServerError("Internal server error");
        }
    }
}