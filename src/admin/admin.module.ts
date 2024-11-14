import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
    const { Database, Resource, getModelByName } = await import(
      '@adminjs/prisma'
    );

    const { AdminJS } = await import('adminjs');
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
