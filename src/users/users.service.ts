import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { User } from 'src/users/schemas/user.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { isatty } from 'tty';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = this.getHashPassword(createUserDto.password);
    let user = await this.userModel.create({
      ...createUserDto,
      password: hashPassword
    });
    return user;
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found user';
    return this.userModel.findOne({
      _id: id
    });
  }

  async loginLocal(email: string, password: string) {
    let user = await this.userModel.findOne({
      email: email,
    });
    let isAuth = compareSync(password, user.password);
    return isAuth ? user : null;
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, updateUserDto);
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found user';
    return this.userModel.deleteOne({
      _id: id
    });
  }

}
