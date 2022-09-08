import { Arg, Mutation, Query, Resolver } from "type-graphql";
import Student from "../entities/student";
import Todo from "../entities/todo";
import { CreateElement, EditElement } from "../inputs/todo";

@Resolver()
class TodoResolver {
    @Mutation(() => Todo)
    async addElements(@Arg("createElement") createElement: CreateElement) {
        try {

            const element = new Todo();
            element.done = createElement.done;
            element.pending = createElement.pending;
            const user = await Student.findOne({ where: { id: createElement.user_id } })
            element.user = user!;
            const todoCreated = await element.save();
            return todoCreated;
        }
        catch (e) {
            throw new Error(`error ---> ${e}`);
        }


    }

    @Mutation(() => Todo)
    async editElements(@Arg("editElement") editElement: EditElement, @Arg("Id") id: string) {
        try {
            const todo = await Todo.findOne({ where: { id: id } });
            if (!todo) throw new Error("Invalid Id");
            if (editElement.done && editElement.pending) {
                todo.done = editElement.done;
                todo.pending = editElement.pending;
            }
            const todoUpdated = await todo.save();
            return todoUpdated;
        } catch (e) {
            throw new Error(`error : ${e}`);
        }

    }

    @Mutation(() => Todo)
    async deleteElements(@Arg("Id") id: string) {
        try {
           const todo =await Todo.findOne({where:{id:id}});
           if(!todo) throw new Error("Invalid Id");
           const deleteElement = await todo.remove();
           return deleteElement;
        } catch (e) {
            throw new Error(`error : ${e}`);
        }

    }
   @Query(()=>Todo)
  async getElement(@Arg("Id")id:String){
    try{
        const todo =await Todo.findOne({where:{id:id}});
        return todo;
    } catch (e){
        throw new Error(`error ---> ${e}`);
    }
  }
    

}

export default TodoResolver;