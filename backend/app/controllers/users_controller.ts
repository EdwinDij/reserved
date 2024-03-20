import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import { v4 as uuidv4 } from 'uuid'

export default class UsersController {
  async register({ request, response }: HttpContext) {
    const { username, email, password } = request.body()
    try {
      const hashedPassword = await hash.make(password)
      const uuid = uuidv4()
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
      if (email.indexOf('@') === -1) {
        return response.status(400).json({ message: 'Veuillez entrer une adresse email valide.' })
      }
      const userExists = await User.findBy('email', email)
      if (userExists) {
        return response
          .status(400)
          .json({ message: 'Un compte avec cette adresse email existe déjà.' })
      }
      const user = await User.create({ uuid, username, email, password: hashedPassword })
      response.redirect('/login')
      return response
        .status(201)
        .json({ username, email, message: 'Votre compte à bien été crée.' })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: 'Erreur serveur.' })
    }
  }
  async login({ request, response }: HttpContext) {
    const { email, password } = request.body()
    try {
      const user = await User.verifyCredentials(email, password)
      if (email === '' || password === '') {
        return response.status(400).json({ message: 'Veuillez remplir les champs.' })
      }
      if (!user) {
        return response.status(400).json({ message: 'Identifiants incorrects.' })
      } else {
        const token = await User.accessTokens.create(user) // Crée un token
        response.status(200).json({ message: 'Vous êtes connecté.', token: token }) // Envoie le token
        response.redirect('/dashboard') // Redirige vers la page de dashboard
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: 'Erreur serveur.' })
    }
  }
}
