import { Controller, Body, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../model/user.schema';

@Controller('/api/v1/user')
export class UserController {
    constructor(private readonly userService: UserService, private jwtService: JwtService) {}

    @Post('/signup')
    async SignUp(@Res() response, @Body() user) {        
        user.createdDate = new Date();
        console.log('User', user);        
        const { fullname, email, password } = user;
        // const userInfo = new User({ fullname, email, password, new Date() })
        const newUser = await this.userService.signup({
    fullname, email, password,
    createdDate: new Date()
});

        return response.status(HttpStatus.CREATED).json({
            newUser
            })
    }

    @Post('/signin')
        async SignIn(@Res() response, @Body() user) {
            console.log('CHK', user)
            const token = await this.userService.signin(user, this.jwtService);
            return response.status(HttpStatus.OK).json(token)
        }
}