const Repository = require('../repositories/repository');
module.exports = class InvitationRepository {
  constructor() {}

  async create(invitation) {

    try {
      return await Repository.Invitation.create(invitation)
    } catch (err) {
      throw new Error(`Could not save invitation: ${err.message} `)
    }
  }

  async getById(id) {
    let query = {
      where: {
        id: id
      }
    }
    try {
      let result = await Repository.Invitation.findOne(query)
      if (!result)
        throw new Error(`There is no invitation with id: ${id}`)
      return result
    } catch (err) {
      throw new Error(
        `Could not get invitation from the DB: ${err.message}`)
    }
  }

  async getByInvitedEmail(invitedEmail) {
    let query = {
      where: {
        invitedEmail: invitedEmail
      }
    }
    try {
      let result = await Repository.Invitation.findAll(query)
      if (!result)
        throw new Error(
          `There is no invitation with email: ${invitedEmail}`)
      return result
    } catch (err) {
      throw new Error(
        `Could not get invitation from the DB: ${err.message}`)
    }
  }

  async update(data, id) {
    try {
      const invitation = await Repository.Invitation.update(data, {
        where: {
          id: id
        }
        , returning: true
      })
      return invitation[1][0]
    } catch (err) {
      const message =
        `Error in the database when updating an Invitation ${JSON.stringify(data)}: ${err.message}`
      throw new Error(message)
    }
  }

}
