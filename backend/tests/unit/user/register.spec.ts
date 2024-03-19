import { test } from '@japa/runner'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

test.group('creating user', () => {
  let user: User //variable pour stocker l'utilisateur
  test('hashes user password', async ({ assert }) => {
    user = new User()
    user.email = 'test@email.fr'
    user.password = 'secretpassword'
    user.username = 'test'
    User.assignUuid(user)
    await user.save()
    assert.notEqual(user.username, '')
    assert.notEqual(user.email, '')
    assert.notEqual(user.password, '')
    assert.notEqual(
      user.username.length < 3 || user.email.indexOf('@') === -1 || user.password.length < 8,
      true
    )
    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'secretpassword'))
  }).teardown(async () => {
    await user.delete()
    console.log('User deleted')
  }) // Delete l'user après le test
})
