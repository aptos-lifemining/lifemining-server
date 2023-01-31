import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multerS3 from 'multer-s3';
import * as path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

export const multerOptionsFactory = (directory: string): MulterOptions => {
  // directory : has to end with a slash
  // e.g. 'videos/', 'profile/images/'
  dotenv.config();
  // s3 인스턴스를 생성합니다.
  const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  return {
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME,
      key(_req, file, cb) {
        const ext = path.extname(file.originalname); // 파일의 확장자 추출
        const basename = path.basename(file.originalname, ext); // 파일 이름
        // 파일 이름이 중복되는 것을 방지하기 위해 파일이름_날짜.확장자 형식으로 설정합니다.
        cb(
          null,
          'lifemining/' + directory + `/${basename}_${Date.now()}${ext}`,
        );
      },
    }),
  };
};
