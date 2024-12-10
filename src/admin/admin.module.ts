import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AdminJS } = require('adminjs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Database, Resource, getModelByName } = require('@adminjs/prisma');

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

@Module({
  providers: [PrismaService],
})
export class AdminModule {
  static async forRootAsync() {
    const adminModule = await import('@adminjs/nestjs');
    const prismaService = new PrismaService();

    AdminJS.registerAdapter({ Database, Resource });

    return adminModule.AdminModule.createAdminAsync({
      useFactory: async function () {
        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: {
                  model: getModelByName('User'),
                  client: prismaService,
                },
              },
            ],
          },
          auth: {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'secret',
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
          },
        };
      },
    });
  }
}
