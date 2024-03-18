import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  async register({ request, response }: HttpContext) {
    const { username, email, password } = request.body()
    const hashedPassword = await hash.make(password)
    try {
      if (username === '' || email === '' || password === '') {
        return response.status(400).json({ message: 'Veuillez remplir les champs.' })
      }
      if (username.length < 3) {
        return response
          .status(400)
          .json({ message: "Le nom d'utilisateur doit contenir au moins 3 caractères." })
      }
      if (password.length < 8) {
        return response
          .status(400)
          .json({ message: 'Le mot de passe doit contenir au moins 8 caractères.' })
      }
    } catch (error) {
      console.log(error)
    }
    return response.status(201).json({ username, email })
  }
  async login() {
    return this.login.name
  }
}
