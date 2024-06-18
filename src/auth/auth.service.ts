import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.loginLocal(email, pass);
        return user;
    }

    async login(user: any) {
        const payload = { email: user.email, _id: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}