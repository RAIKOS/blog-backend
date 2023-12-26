import Joi from 'joi';
import User from '../../models/user';

/*
POST /api/auth/register
username : veloport
password : mypass123
*/
export const register = async (ctx) => {
  // Request Body 검증
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body;
  try {
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409;
      return;
    }

    const user = new User({
      username,
    });
    await user.setPassword(password);
    await user.save();

    // hashedPassword 제거
    const data = user.toJSON();
    delete data.hashedPassword;
    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.ser('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
      httpOnly: true, // 스크립트로 쿠키 조회 불가 옵션
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
POST /api/auth/login
{
    username:velopert
    password:mypass123
}
*/
export const login = async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 401;
    return;
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      // 계정이 없으면
      ctx.status = 401;
      return;
    }
    const valid = await user.checkPassword(password);
    if (!valid) {
      // 비번 틀림
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const check = async (ctx) => {};

export const logout = async (ctx) => {};
