import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';

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

  // 챌린지 제목
  @ApiProperty({
    example: '챌린지 부제목',
    description: '앱토스 해커톤에서 3일 동안 프로덕트를 빌딩하세요.',
  })
  @Column()
  subTitle: string;

  // 챌린지 설명
  @ApiProperty({
    example: '챌린지 설명',
    description:
      '빌더들을 위한 3일짜리 해커톤입니다. 참여하게 되면, 많은 혜택이 있습니다.',
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

  // 챌린지 시작 기준일
  @ApiProperty({
    example: '2021-08-01',
    description: '챌린지 시작 기준일',
  })
  @Column()
  startDate: string;

  // 챌린지 합격 기준 일수
  @ApiProperty({
    example: 7,
    description: '챌린지 합격 기준 일수',
  })
  @Column()
  passDays: number;

  // 챌린지 종류: ENUM
  @ApiProperty({
    example: 'excercise',
    description: '챌린지 종류 excercise | develop | art',
  })
  @Column({
    type: 'enum',
    enum: ['excercise', 'develop', 'art'],
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

  // 챌린지 이미지 URL
  @ApiProperty({
    example:
      'https://dev-static-files.uzumeta.com/lifemining/challenge-images/test.jpg',
    description: '챌린지 이미지 URL',
  })
  @Column()
  imageUrl: string;

  // 챌린지 크리에이터 아이디
  @ApiProperty({
    example: 'bffacaa8-0b04-4449-aa39-f65e64f3aa9a',
    description: '챌린지 매니저 아이디',
  })
  @Column()
  creatorId: string;

  // 크리에이터
  @ApiProperty({
    type: () => User,
    example: User,
    description: '챌린지 크리에이터',
  })
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'creatorId' })
  creator: User;
}
