import { Router } from "express";
import { CategoryController } from "./controllers";
import { AuthMiddleWare } from "../midlewares/auth.midleware";
import { CategoryService } from "../services/category-service";


export class CategoryRoutes{



    static get routes():Router{
        const router=Router();
        const categoryService = new CategoryService();
        const controller = new CategoryController(categoryService);

        router.get("/",controller.getCategory);
        router.post("/",[AuthMiddleWare.validateJwt],controller.createCategory);


        return router;
    }



}