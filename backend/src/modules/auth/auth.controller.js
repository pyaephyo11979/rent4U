const authService = require('./auth.service');
const { registerSchema, loginSchema, refreshTokenSchema } = require('./auth.validator');
const { successResponse } = require('../../utils/response');
const config = require('../../config');

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const user = await authService.register(data);
    res.status(201).json(successResponse(user, 'Registration successful'));
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      maxAge: config.cookie.refreshMaxAge,
    });

    res.json(successResponse({
      accessToken: result.accessToken,
      user: result.user,
    }, 'Login successful'));
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    refreshTokenSchema.parse({ refreshToken: token });

    const result = await authService.refreshAccessToken(token);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      maxAge: config.cookie.refreshMaxAge,
    });

    res.json(successResponse({ accessToken: result.accessToken }, 'Token refreshed'));
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    await authService.logout(req.user.id, token);

    res.clearCookie('refreshToken');
    res.json(successResponse(null, 'Logged out successfully'));
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout };
