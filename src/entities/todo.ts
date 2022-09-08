import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Student from "./student";

@Entity("Todo")
@ObjectType("Todo")
class Todo extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    @Field()
    id: string;

    @Column()
    @Field()
    done: string;

    @Column()
    @Field()
    pending: string;

    @ManyToOne(() => Student, user => user.todos)
    @Field(() => Student)
    user: Student

    @CreateDateColumn()
    @Field()
    date: string;

}

export default Todo;