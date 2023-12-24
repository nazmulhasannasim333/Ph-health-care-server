import * as bcrypt from 'bcrypt';
import config from '../../../config';

export const hashedPassword = async (password: string): Promise<string> => {
    try {
        const hashedPassword: string = await bcrypt.hash(password, Number(config.bycrypt_salt_rounds));
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
}
