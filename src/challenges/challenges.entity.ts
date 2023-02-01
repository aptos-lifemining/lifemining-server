import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Challenge {
  // id
  @ApiProperty({
    example: '1',
    description: 'DB ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  // 챌린지 제목
  @ApiProperty({
    example: '챌린지 제목',
    description: '앱토스 해커톤 챌린지',
  })
  @Column()
  title: string;

  // 챌린지 설명
  @ApiProperty({
    example: '챌린지 설명',
    description: '10일짜리 설명입니다.',
  })
  @Column({ nullable: true })
  description: string;

  // 챌린지 참여 기간 (일)
  @ApiProperty({
    example: 10,
    description: '챌린지 참여 일수',
  })
  @Column()
  totalDays: number;

  // 챌린지 합격 기준 일수
  @ApiProperty({
    example: 7,
    description: '챌린지 합격 기준 일수',
  })
  @Column()
  passDays: number;

  // 챌린지 종류: ENUM (1: excercise, 2: development, 3: writing)
  @ApiProperty({
    example: 'development',
    description: '챌린지 종류 excercise | development | writing',
  })
  @Column({
    type: 'enum',
    enum: ['excercise', 'development'],
    default: 'excercise',
  })
  type: string;

  // 챌린지를 위해 스테이킹 해야 하는 앱토스
  @ApiProperty({
    example: 2.5,
    description: '챌린지를 위해 스테이킹 해야 하는 앱토스',
  })
  @Column({ default: 2.5 })
  stakingAPT: number;
}
