import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, MinLength, MaxLength } from "class-validator";
import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../../../configuration/user.config";

export class RegisterUserDto {

    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH)
    @MaxLength(PASSWORD_MAX_LENGTH)
    @ApiProperty()
    password: string;

    @IsString()
    @MinLength(NICKNAME_MIN_LENGTH)
    @MaxLength(NICKNAME_MAX_LENGTH)
    @ApiProperty()
    nickname: string;
}
