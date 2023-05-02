import { Comment as PrismaComment, User } from '@prisma/client'

export type Comment = PrismaComment & {
  user: Omit<User, 'password' | 'gender' | 'birthDate'>
}

export type CommentData = Omit<PrismaComment, 'id' | 'createdAt' | 'updatedAt'>
