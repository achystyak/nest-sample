import { forwardRef, Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { PublisherGateway } from './publisher.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from '../api/user/user.module';

@Module({
  imports: [
    forwardRef(() => AuthModule)
  ],
  providers: [PublisherGateway, PublisherService],
  exports: [PublisherGateway]
})
export class PublisherModule { }
