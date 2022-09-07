import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import * as dotenv from "dotenv";
import entities from './entities/index';
import resolvers from './resolver/index';
dotenv.config()

const main = async () => {
    const schema = await buildSchema({
        resolvers
    });
    const server = new ApolloServer({
        schema
    });

    server.listen(4000, () => {
        console.log("server started on http://localhost:4000");
    });
};

createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    entities,
    logging: true,
}).then(() => {
    console.log('COnnected');
    main();
})