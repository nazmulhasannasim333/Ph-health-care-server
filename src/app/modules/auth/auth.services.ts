import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';

import {
    IChangePassword,
    ILoginUser,
    ILoginUserResponse,
    IRefreshTokenResponse,
} from './auth.interface';
import prisma from '../../../shared/prisma';
import { AuthUtils } from './auth.utils';
import { hashedPassword } from '../../../helpers/hashPasswordHelper';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
    const { email, password } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: { email }
    });

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    }

    if (
        isUserExist.password &&
        !(await AuthUtils.comparePasswords(password, isUserExist.password))
    ) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
    }

    const { id: userId, role, needPasswordChange } = isUserExist;
    const accessToken = jwtHelpers.createToken(
        { userId, role, email },
        config.jwt.secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.createToken(
        { userId, role },
        config.jwt.refresh_secret as Secret,
        config.jwt.refresh_expires_in as string
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange
    };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
    //verify token
    // invalid token - synchronous
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers.verifyToken(
            token,
            config.jwt.refresh_secret as Secret
        );
    } catch (err) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
    }

    const { userId } = verifiedToken;

    const isUserExist = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    }

    const newAccessToken = jwtHelpers.createToken(
        {
            userId: isUserExist.id,
            role: isUserExist.role,
        },
        config.jwt.secret as Secret,
        config.jwt.expires_in as string
    );

    return {
        accessToken: newAccessToken,
    };
};

const changePassword = async (
    user: JwtPayload | null,
    payload: IChangePassword
): Promise<void> => {
    const { oldPassword, newPassword } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: {
            id: user?.userId
        }
    });

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    }

    // checking old password
    if (
        isUserExist.password &&
        !(await AuthUtils.comparePasswords(oldPassword, isUserExist.password))
    ) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
    }

    const hashPassword = await hashedPassword(newPassword);

    await prisma.user.update({
        where: {
            id: isUserExist.id
        },
        data: {
            password: hashPassword,
            needPasswordChange: false
        }
    })
};

// const forgotPass = async (payload: { id: string }) => {

//     const user = await User.findOne({ id: payload.id }, { id: 1, role: 1 });

//     if (!user) {
//         throw new ApiError(httpStatus.BAD_REQUEST, "User does not exist!")
//     }

//     let profile = null;
//     if (user.role === ENUM_USER_ROLE.ADMIN) {
//         profile = await Admin.findOne({ id: user.id })
//     }
//     else if (user.role === ENUM_USER_ROLE.FACULTY) {
//         profile = await Faculty.findOne({ id: user.id })
//     }
//     else if (user.role === ENUM_USER_ROLE.STUDENT) {
//         profile = await Student.findOne({ id: user.id })
//     }

//     if (!profile) {
//         throw new ApiError(httpStatus.BAD_REQUEST, "Pofile not found!")
//     }

//     if (!profile.email) {
//         throw new ApiError(httpStatus.BAD_REQUEST, "Email not found!")
//     }

//     const passResetToken = await jwtHelpers.createResetToken({ id: user.id }, config.jwt.secret as string, '50m')

//     const resetLink: string = config.resetlink + `token=${passResetToken}`

//     console.log("profile: ", profile)
//     await sendEmail(profile.email, `
//       <div>
//         <p>Hi, ${profile.name.firstName}</p>
//         <p>Your password reset link: <a href=${resetLink}>Click Here</a></p>
//         <p>Thank you</p>
//       </div>
//   `);

//     // return {
//     //   message: "Check your email!"
//     // }
// }

// const resetPassword = async (payload: { id: string, newPassword: string }, token: string) => {

//     const { id, newPassword } = payload;
//     const user = await User.findOne({ id }, { id: 1 })

//     if (!user) {
//         throw new ApiError(httpStatus.BAD_REQUEST, "User not found!")
//     }

//     const isVarified = await jwtHelpers.verifyToken(token, config.jwt.secret as string);

//     const password = await bcrypt.hash(newPassword, Number(config.bycrypt_salt_rounds))

//     await User.updateOne({ id }, { password });
// }

export const AuthService = {
    loginUser,
    refreshToken,
    changePassword
};