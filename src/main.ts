import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SearchModule } from './search.module';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3002,
      },
    },
  );

  const adminConfig: ServiceAccount = {
    projectId: 'xxxxxx',
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nxxxxxxxxxxxxxE1uc0\nqJxEl91LRb5Qw9zv2d7eezVv6+RgOiNx9tAmD2Pf8Uua1A0kVSvKfQG4Ryp53mCS\n8LVvHDh736mDiFb2ZfuIPIX8OgwfthieI03Htkplaugk8qFvQtxHxiLgN40lnwPB\npvOR8GPa2UyRgU61i6m3OJCm3JIKv0NVl7QQY8xiwUf1pjRVoDCXesgPul2HC71n\nkt+P3FYRbR+gKcbzSKjY07MSCg+Y0QqdGu+rk45lOU3RceWJH1By91Re/mOTjLZy\no6jCLkiA9frSa31FSQ/ZCpa/lxty5Da69xxxxxxxxiZg\nc24hYP8nAgMBAAECggEAIGCZjJu5LboLOKxxxxxxxxxVoBv2eDkP35EyAM8mIWawGQpe+Najg2C5OtArInQfsxR53/NOORpcafXrk\nsrDaXNUpIH2/+davHJ0vc5FSeczMDEZpZjD0XusNRyO8+ocnMNKgVWv+2G9F5WLs\noGwm0CQMEc/DntOmHYyAuNA7lM8Zjr6NaqkQGMaXqPXtwPxSENwEe7DwuJahzNYm\nJMoE8XwfV9RF3BQYFlFzceW/to5AMfxvdBClXML5SNVQiNaT1B+kjilne7kxVwzh\nt8STZEJIxdqsBVO6dF8gg8YOFJVrHVOyBKPgWPF1YQKBgQC7O7gHobZy9X4U90Sn\nB0GJ07aPWTsQXbapRTQyPA/yX2LHy1g7R4J2DW5S21d/WCJbQwaf70xRs9Ar9kUU\n4N29lKxMADGPDw8d1XLKOiVMBIrLIoRq2pEAU4lcPQMrd2X0OngHzbtaWt/Py0Ri\n9LiIydLfMZ14lCaGanUnVAixFwKBgQC7C2LyICr+dPCWY9iESpzvQ23MQvz1wbME\n5azYklJ/Q+WPOLfyRqZ4pWEcY2bzSbYL1/jrJjPY5EAoK+pZW0VKhhLkHyBt2y2K\n38SgUcvJgc5F0Sg8o92yLP4GONMyo8TBA5otPAC2LkEW3a89HHCl3/WqsD7e7B0S\nUIFWnchMcQKBgBrObwewsHV/DmEkxxxxxxxxxKh\n51zNiXkVbE6QKMMWMpGdajjcXLaemL9nfnfRHGX5NR89UbW8xKWNc5+RmumAdKLz\nzgTU8PqixZxoiNFRubOsUeGa1yZh/NWKIg17j9Rivx/vXiCqh0FtN51bAoGAE+3/\nqfrheeFt7ShQXrAwjpHpthUBLRJph8ENLLpSjfrnD96kQu1iOYKtmT/CLXQSMKrf\ne/bDGX4gk+cx/jlqZalpg+MJKotrC9wR8F8mzp7FIs1Jc0Smj6CZpIIThtbKVSKU\nH/O/w6mkB9KxJFrOae42F+zVlh0kb9oiHd+MAxECgYEAuEE0RunWFH77eTuFrDz/\nBXEEBZcf7w0IAUO7KTJmWq5YKC9yX4gaTSXYSFvBi7/g6VVXnYMikAakIvj4eQkY\nqLcxvdHx9WL7cCuqxoViJP8wI4YzWp7/hJ7RL3+rJ7xFDLRosjU6JULukier6oCR\nxxxxxxxxxxxxxx\n-----END PRIVATE KEY-----\n',
    clientEmail:
      'xxxxx.gserviceaccount.com',
  };
  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: 'https://xxxxx.firebaseio.com',
  });

  await app.listen();
}
bootstrap();
