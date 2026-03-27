import * as Prisma from './internal/prismaNamespaceBrowser';
export { Prisma };
export * as $Enums from './enums';
export * from './enums';
/**
 * Model answers
 *
 */
export type answers = Prisma.answersModel;
/**
 * Model questions
 *
 */
export type questions = Prisma.questionsModel;
/**
 * Model topics
 *
 */
export type topics = Prisma.topicsModel;
/**
 * Model users
 * This collection uses a JSON Schema defined in the database, which requires additional setup for migrations. Visit https://pris.ly/d/mongodb-json-schema for more info.
 */
export type users = Prisma.usersModel;
