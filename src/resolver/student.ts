import { Arg, Authorized, Mutation, Query, Resolver, Ctx, FieldResolver, Root } from "type-graphql";
import Student from "../entities/student";
import { Change, LoginInput, NewStudent } from "../inputs/student";
import bcryptjs from "bcryptjs";
import LoginOutput from "../utils/LoginOutput";
import jwt from "jsonwebtoken";
import MyContext from "../utils/context";

@Resolver(() => Student)
class StudentResolver {
    @Query(() => String)
    async hello() {
        return 'hello world'
    }

    @Mutation(() => Student)
    async createStudent (@Arg("new") studentInfo : NewStudent)  {
        try{
            let student = Student.create({
                name : studentInfo.name,
                email : studentInfo.email,
                password : bcryptjs.hashSync(studentInfo.password, Number(process.env.ITR))
            }).save();

            return student;
        }
        catch (e){
            throw new Error(`error ---> ${e}`);
        }
    }

    @Mutation(() => LoginOutput)
    async login(@Arg("loginInput") {email, password} : LoginInput) {
        try{
            let student = await Student.findOne({email : email});
            console.log(student);

            if (!student) throw new Error("Invalid Email");

            let passwordIsValid = bcryptjs.compareSync(password, student.password);

            if (!passwordIsValid) throw new Error("Invalid password");

            let token = jwt.sign(student.id, process.env.JWT_SECRET!);

            return {
                token : token,
                status : true
            }
        }
        catch(e){
            throw new Error(`error ---> ${e}`);
        }
    }

    @Mutation(() => Student)
    @Authorized()
    async update (@Ctx() {student} : MyContext, @Arg("Changes") updatedInfo : Change){
        try{
            if (updatedInfo.email) student.email = updatedInfo.email;
            if (updatedInfo.name) student.name = updatedInfo.name;
            if (updatedInfo.password) student.password = bcryptjs.hashSync(updatedInfo.password); // default number of iteration = 10

            let newStudent = await student.save();

            return newStudent;
        }
        catch(e){
            throw new Error(`error ---> ${e}`);
        }
    }

    @FieldResolver()
    async todos(@Root() { id }: Student) {
        const user = await Student.findOne({ where: { id: id }, relations: ["todos"] });
        try {
            return user?.todos;
        } catch (e) {
            throw new Error(`error ---> ${e}`);
        }
    }

}

export default StudentResolver;
