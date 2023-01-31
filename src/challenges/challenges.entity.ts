import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
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
  days: number;

  @ApiProperty({
    example:
      '0xb8542ced3b91535ec569a537a7eff91bec498f25bca349473b6e2856529787ba',
    description: '챌린지 매니저 User ID',
  })
  @Column()
  managerId: string;

  // 챌린지 매니저 (한 명)
  @ManyToOne(() => User)
  manager: User;

  // 챌린지 참여자 (여러 명)
  @ManyToMany(() => User)
  @JoinTable({
    joinColumns: [{ name: 'challengeId' }],
    inverseJoinColumns: [{ name: 'userId' }],
  })
  challengers: User[];
}
