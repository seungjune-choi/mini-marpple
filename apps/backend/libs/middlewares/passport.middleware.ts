import RedisStore from 'connect-redis';
import { Router } from 'express';
import Redis from 'ioredis';
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import { container } from 'tsyringe';
import { DATA_SOURCE, DataSource } from '@libs/database';
import * as console from 'node:console';
import { TargetUser } from '@backend/core';

const redisStore = new RedisStore({
  client: new Redis(),
  prefix: 'session:',
});

export function initializeSession(app: Router) {
  app.use(
    session({
      store: redisStore,
      secret: 'secret',
      resave: true,
      saveUninitialized: false,
      name: '_sid_',
      proxy: true,
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    } as session.SessionOptions),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user as Express.User);
  });

  passport.use(
    new passportLocal.Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (email, password, done) => {
        try {
          const dataSource = container.resolve<DataSource>(DATA_SOURCE);
          const user = await dataSource.$query`
            SELECT 
                id, 
                email, 
                password,
                is_admin as "isAdmin"
            FROM 
                users 
            WHERE 
                email = ${email}`.then((res) => res[0]);

          if (!user) {
            return done(null, false, { message: '존재하지 않는 이메일입니다.' });
          }

          if (!(user.password === password)) {
            return done(null, false, { message: '비밀번호가 틀렸습니다.' });
          }

          return done(null, {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
          } as TargetUser);
        } catch (error) {
          console.error(error);
          done(error);
        }
      },
    ),
  );
}
