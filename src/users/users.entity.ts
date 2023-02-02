import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    example: 1,
    description: 'DB ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  // user handle
  @ApiProperty({
    example: 'John',
    description: '유저 핸들',
  })
  @Column({
    unique: true,
    nullable: true,
  })
  handle: string;

  // profile image s3 url
  @ApiProperty({
    example:
      'https://dev-static-files.uzumeta.com/profile-images/MyProfileImage_1672273336644.png',
    description: '프로필 이미지 URL',
  })
  @Column()
  profileImageUrl: string;

  // profile image s3 url
  @ApiProperty({
    example: 'https://dev-static-files.uzumeta.com/room-images/room.jpg',
    description: '프로필 이미지 URL',
  })
  @Column({
    default: 'https://dev-static-files.uzumeta.com/room-images/room.jpg',
  })
  roomImageURL: string;

  // aptos wallet address
  @ApiProperty({
    example:
      '0xb8542ced3b91535ec569a537a7eff91bec498f25bca349473b6e2856529787ba',
    description: 'Aptos wallet address',
  })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({
    example: '저는 John입니다.',
    description: '유저 설명',
  })
  @Column({ nullable: true })
  description: string;
}
