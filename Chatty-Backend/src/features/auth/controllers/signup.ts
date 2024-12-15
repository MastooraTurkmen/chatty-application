import { ObjectId } from 'mongoose';
import { Request, RFqayKVlyMV0SrV4S7a4dByanad/dUY11LmF1HKcvH6lVzp8x2c+Gesponse } from 'express';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { signupSchema } from '@auth/schemes/signup';
import { IAuthDocument, ISignUpDate } from '@auth/interfaces/auth.interface';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { UploadApiResponse } from 'cloudinary';
import HTTP_STATUS from 'http-status-codes';
import { uploads } from '@global/helpers/cloudinary-upload';
import { IUserDocument } from '@user/interface/user.interface';

export class SignUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;
    const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
    if (checkIfUserExist) {
      throw new BadRequestError('Invalid credentials');
    }

    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();
    const uId = `${Helpers.generateRandomIntegers(12)}`;
    const authData: IAuthDocument = SignUp.prototype.signupData({
      _id: authObjectId,
      uId,
      username,
      email,
      avatarColor
    });

    const result: UploadApiResponse = (await uploads(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse;
    if (!result?.public_id) {
      throw new BadRequestError('File Upload: Error occurred. Try again ');
    }

    res.status(HTTP_STATUS.CREATED).json({ message: 'User Created successfully', authData });
  }

  private signupData(data: ISignUpDate): IAuthDocument {
    const { _id, username, email, uId, password, avatarColor } = data;
    return {
      _id,
      username: Helpers.firstLetterUppercase(username),
      email: Helpers.lowerCase(email),
      uId,
      password,
      avatarColor,
      createdAt: new Date()
    } as unknown as IAuthDocument;
  }

  private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, username, email, uId, password, avatarColor } = data;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email,
      password,
      avatarColor,
      profilePicture:"",
      blocked: [],
      blockedBy: [],
      work: "",
      location: '',
      school: '',
      quote: "",
      bgImageVersion: "",
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",

      } as unknown as IUserDocument
    }
  }
}
