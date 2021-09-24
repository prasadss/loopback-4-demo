import {repository} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import bcrypt from 'bcrypt';
import qrCode from 'qrcode';
import speakeasy from 'speakeasy';
import {User} from '../models';
import {Login} from '../models/login.model';
import {UserRepository} from '../repositories';

export class AuthenticationController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/api/register')
  @response(200, {
    description: 'Register',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'register',
          }),
        },
      },
    })
    user: User,
  ) {
    try {
      let users = await this.userRepository.findOne({
        where: {
          email: user.email,
        },
      });
      if (users) {
        return 'User already exist!';
      }
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const secret = speakeasy.generateSecret();
      await this.userRepository.create({
        ...user,
        password: hashedPassword,
        secret: secret.base32,
      });

      const qrCodeUrl = await qrCode.toDataURL(secret.otpauth_url as string);
      return {
        qrCodeUrl,
        secret: secret.base32,
      };
    } catch (ex) {
      return {
        error_message: ex.message,
      };
    }
  }
  @post('/api/login')
  @response(200, {
    description: 'Login',
    content: {'application/json': {schema: getModelSchemaRef(Login)}},
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Login, {
            title: 'login',
          }),
        },
      },
    })
    login_user: Login,
  ) {
    try {
      const {email, password, token} = login_user;
      let user = await this.userRepository.findOne({
        where: {
          email,
        },
      });
      console.log(1, user, email, password, token);
      console.log(2, !bcrypt.compareSync(password, user ? user.password : ''));
      console.log(
        !speakeasy.totp.verify({
          secret: user ? user.secret : '',
          encoding: 'base32',
          token,
        }),
      );

      if (
        !user ||
        !bcrypt.compareSync(password, user.password) ||
        !speakeasy.totp.verify({
          secret: user.secret,
          encoding: 'base32',
          token,
        })
      ) {
        return {error: 'Invalid credentials'};
      }
      return {user};
    } catch (ex) {
      return {
        error_message: ex.message,
      };
    }
  }
}
