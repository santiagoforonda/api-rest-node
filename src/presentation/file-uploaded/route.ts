import { Router } from "express";
import { FileController } from "./controller";
import { FileUploadService } from "../services/file-service";
import { FileUploadMiddleware } from "../midlewares/file-upload.middleware";
import { TypeMiddleWare } from "../midlewares/type.middleware";



export class FileUploadRoutes{


    static get routes():Router{

        const router = Router();
        const fileSerivce = new FileUploadService();
        const controller = new FileController(fileSerivce);


        router.use(FileUploadMiddleware.containFiles);
        router.use(TypeMiddleWare.validType(["users","products","categories"]));

        router.post("/single/:type",controller.uploadFile);
        router.post("/multiple/:type",controller.uploadMultipleFiles);

        return router;
    }
}