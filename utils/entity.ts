import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Hashed password using bcrypt

  @Column({ nullable: true })
  profilePicture?: string; // <-- NEW (optional)
}
