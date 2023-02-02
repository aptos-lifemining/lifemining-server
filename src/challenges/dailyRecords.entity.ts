import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';
import { Challenge } from './challenges.entity';

@Entity()
export class DailyRecord {
  // id
  @ApiProperty({
    example: '1',
    description: 'DB ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  // 참여일
  @ApiProperty({
    example: '2021-01-01 00:00:00',
    description: '참여 시간',
  })
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // 챌린저 아이디
  @ApiProperty({
    example: 1,
    description: '챌린저 아이디',
  })
  @Column({ nullable: false })
  challengerId: number;

  // 챌린지 참여자
  @ManyToOne(() => User)
  @JoinColumn({ name: 'challengerId' })
  challenger: User;

  // 챌린지 아이디
  @ApiProperty({
    example: '1',
    description: '챌린지 아이디',
  })
  @Column({ nullable: false })
  challengeId: number;

  // 챌린지
  @ManyToOne(() => Challenge)
  @JoinColumn({ name: 'challengeId' })
  challenge: Challenge;

  // video thumbnail
  @ApiProperty({
    example: 'thumbnail url',
    description: '썸네일 url',
  })
  @Column({ nullable: false })
  thumbnailUrl: string;

  // video s3 url
  @ApiProperty({
    example: 'video s3 url',
    description: '영상 기본저장 s3 url',
  })
  @Column({ nullable: false })
  s3Url: string;

  // video streaming url
  @ApiProperty({
    example: 'video streaming url', // TODO : streaming url 채워넣기
    description: '영상 미디어컨버트 url for streaming',
  })
  @Column({ nullable: false })
  streamingUrl: string;
}
