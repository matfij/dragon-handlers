import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/model/user.entity';
import { IUser } from '../../user/model/user.interface';
import { SALT_ROUNDS } from '../../../configuration/user.config';
import { LoginUserDto } from '../dto/login-user.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { GetUserDto } from '../../user/model/dto/get-user.dto';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async login(dto: LoginUserDto): Promise<AuthResponseDto> {
        const user = await this.userRepository.findOne({ nickname: dto.nickname });
        if (!user) throw new NotFoundException();

        const match: boolean = await this.validatePassword(dto.password, user.password);
        if (!match) throw new BadRequestException('Incorrect password');

        const token = await this.generateJwt(user);
        return {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            accessToken: token,
        };
    }

    async register(dto: RegisterUserDto): Promise<AuthResponseDto> {
        if (await this.emailExists(dto.email)) throw new BadRequestException('Email occupied');
        if (await this.nicknameExists(dto.nickname)) throw new BadRequestException('Nickname occupied');

        const hashedPassword = await this.hashPassword(dto.password);
        const newUser: IUser = {
            email: dto.email,
            password: hashedPassword,
            nickname: dto.nickname,
        };

        const createdUser = this.userRepository.create(newUser);
        this.userRepository.save(createdUser);

        const token = await this.generateJwt(createdUser);
        return {
            id: createdUser.id,
            email: createdUser.email,
            nickname: createdUser.nickname,
            accessToken: token,
        };
    }

    async generateJwt(user: IUser): Promise<string> {
        return this.jwtService.signAsync({ user });
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, SALT_ROUNDS);
    }

    async validatePassword(password: string, hashedPassword: string): Promise<any> {
        return bcrypt.compare(password, hashedPassword);
    }

    private async emailExists(email: string): Promise<boolean> {
        const params: GetUserDto = { email: email };
        const users = await this.userRepository.find(params);

        return users.length > 0;
    }

    private async nicknameExists(nickname: string): Promise<boolean> {
        const params: GetUserDto = { nickname: nickname };
        const users = await this.userRepository.find(params);

        return users.length > 0;
    }
}
