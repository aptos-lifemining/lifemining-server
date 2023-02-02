import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';
import { Challenge } from './challenges.entity';

@Entity()
@Index(['challengerId', 'challengeId'], { unique: true })
export class TotalRecord {
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
    example: '1',
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
  @ApiProperty({ type: () => Challenge, description: '챌린지' })
  challenge: Challenge;

  // 총 참여 일수
  @ApiProperty({
    example: '0',
    description: '총 참여 일수',
  })
  @Column({ nullable: false, default: 0 })
  participationDays: number;

  // 클레임 가능 여부
  @ApiProperty({
    example: 'false',
    description: '클레임 가능 여부',
  })
  @Column({ nullable: false, default: false })
  claimable: boolean;

  // 클레임 완료 여부
  @ApiProperty({
    example: 'false',
    description: '클레임 완료 여부',
  })
  @Column({ nullable: false, default: false })
  claimed: boolean;
}
