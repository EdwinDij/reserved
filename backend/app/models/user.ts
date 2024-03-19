import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

let uuid = uuidv4()
export default class User extends compose(BaseModel, AuthFinder) {
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  static selfAssignPrimaryKey = true

  @column()
  declare id: number

  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare username: string

  @column()
  declare email: string

  static assignUuid(user: User) {
    user.uuid = uuid
  }

  @column()
  declare password: string

  @column()
  declare isPrenium: boolean

  @column()
  declare plan: string[] | null

  @column()
  declare numberShop: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
