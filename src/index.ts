import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import * as dotenv from "dotenv";
import entities from './entities/index';
import resolvers from './resolver/index';
import jwt from "jsonwebtoken";
import Student from "./entities/student";
import authchecker from "./utils/authchecker";

dotenv.config()

const main = async () => {
    const port = process.env.PORT;
    const schema = await buildSchema({
        resolvers,
        authChecker : authchecker
    });
    const server = new ApolloServer({
        schema,
        context : async ({req} : {req: any}) => {
            try{
                if (req.headers.authorization){
                    let token = req.headers.authorization;
                    const decoded : any = jwt.verify(
                        token,
                        process.env.JWT_SECRET!
                      );

                    let student = await Student.findOne({id : decoded});

                    return {student};
                }
            }
            catch(e){
                throw new Error(`error ---> ${e}`);
            }   
            
        }
    });

    server.listen(port, () => {
        console.log(`server started on http://localhost:${port}`);
    });
};

createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    entities,
    logging: false,
}).then(() => {
    console.log('Connected');
    main();
})