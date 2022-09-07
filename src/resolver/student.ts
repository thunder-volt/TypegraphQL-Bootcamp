import { Query, Resolver } from "type-graphql";

@Resolver()
class StudentResolver {
    @Query(() => String)
    async hello() {
        return 'hello world'
    }
}

export default StudentResolver;
