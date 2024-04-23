import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJSDoc.Options={
    definition:{
        openapi: '3.0.0',
        info:{
            title:"Domino Elite Documentacion",
            version:"1.0.0"
        },
    },
    apis:[`${path.join(__dirname,'./routes/*')}`]
}

const swggerSpec = swaggerJSDoc(options)

export default swggerSpec