require('dotenv').config()
const axios = require('axios')
const interceptors = require('../interceptors/axios-interceptors')
const OrganizationRepository = require('../repositories/organization-repository')
const Logger = require('centinela-logger')
const logger = new Logger(__filename)

const ORGANIZATION_MS_URL = process.env.ORGANIZATION_MS_URL
const ORGANIZATION_MS_TIMEOUT = process.env.ORGANIZATION_MS_TIMEOUT

module.exports = class OrganizationService {
  constructor() {
    this.repository = new OrganizationRepository()
  }

  async create(organization) {
    let externalOrg = await createOrganizationRPI(organization)
    let organizationToSave = {
      foreignId: externalOrg.id
      , name: externalOrg.name
    }
    return await this.repository.create(organizationToSave)
  }

  async getByForeignId(foreignId) {
    return await this.repository.findByForeignId(foreignId)
  }
  async getById(id) {
    return await this.repository.findById(id)
  }
}

async function createOrganizationRPI(organization) {
  logger.debug(`Requesting the creation of a new organization to the Organization microservice: ${ORGANIZATION_MS_URL}`)
  try {
    axios.interceptors.request.use(interceptors.addTransactionID)
    let response = await axios.post(
      ORGANIZATION_MS_URL
      , organization, {
        timeout: ORGANIZATION_MS_TIMEOUT
      })
    return response.data
  } catch (err) {
    logger.error(`Error requesting the creation of a new organization to the Organization microservice: ${err.message}`)
    throw err
  }
}
