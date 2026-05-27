import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty, IsOptional, IsString, MaxLength} from "class-validator";

@InputType()
export class ChangeProfileInput {

    @Field(()=>String)
    @IsString()
    @IsNotEmpty()
    public username:string

    @Field(()=>String)
    @IsString()
    @IsNotEmpty()
    public displayName:string

    @Field(()=>String)
    @IsString()
    @IsOptional()
    @MaxLength(300)
    public bio?:string

}