import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Todo from "./todo";

@Entity('Student') //We've amde a table called students
@ObjectType('Student') //We've said that it stores obj students
class Student extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field()
    id: string;

    @Column()
    @Field()
    name: string;

    @Column()
    @Field()
    email : string;

    @Column()
    password : string;


    @OneToMany(() => Todo, todos => todos.user)
   @Field(() => [Todo], { nullable: true })
   todos: Todo[]


}

export default Student;