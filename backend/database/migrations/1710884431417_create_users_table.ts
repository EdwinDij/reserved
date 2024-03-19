import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid').notNullable().unique().primary()
      table.string('username').notNullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.boolean('is_prenium').defaultTo(false)
      table.json('plan')
      table.integer('number_shop')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
