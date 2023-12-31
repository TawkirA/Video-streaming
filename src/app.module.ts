import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { secret } from './utils/constants';
import { join } from 'path/posix';
import { AppController } from './app.controller';
import { UserController } from './controller/user.controller';
import { VideoController } from './controller/video.controller';
import { AppService } from './app.service';
import { UserService } from './service/user.service';
import { VideoService } from './service/video.service';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.schema';
import { Video, VideoSchema } from './model/video.schema';
import { isAuthenticated } from './app.middleware';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/<Project_Name>'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),

    JwtModule.register({
      secret,
      signOptions: { expiresIn: '2h' }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/public')
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          const ext = file.mimetype.split('/')[1];
          cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
        }
      })
    })
  ],
  controllers: [AppController, UserController, VideoController],
  providers: [AppService, UserService, VideoService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthenticated)
      .exclude(
        { path: 'api/v1/video/:id', method: RequestMethod.GET }
      )
      .forRoutes(VideoController)
  }
}
