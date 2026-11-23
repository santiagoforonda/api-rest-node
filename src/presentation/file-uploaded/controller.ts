import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/file-service";
import { UploadedFile } from "express-fileupload";


export class FileController{



    constructor(
        private readonly fileservice:FileUploadService
    ){

    }


    private handleError=(error:unknown,res:Response)=>{
        if(error instanceof CustomError){
                    return res.status(error.statusCode).json({error:error.message});
                }
                
                console.log(`${error}`);
                return res.status(500).json({error:"Internal server error"});
    }

    uploadFile=(req:Request,res:Response) =>{
        
        const type = req.params.type;
        const files = req.body.files.at(0) as UploadedFile;

        this.fileservice.uploadSingle(files,`upload/${type}`)
        .then(uploaded =>res.json(uploaded))
        .catch(error=>this.handleError(error,res));


        res.json("uploadFile");
    }


    uploadMultipleFiles=(req:Request,res:Response)=>{
        

        const files = req.body.files.at(0) as UploadedFile[];
        const type = req.params.type;
        this.fileservice.uploadMultiple(files,`upload/${type}`)
        .then(uploaded =>res.json(uploaded))
        .catch(error=>this.handleError(error,res));


        res.json("uploadFile");
    }
}