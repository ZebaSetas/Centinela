const express = require('express')
const router = express.Router()

const PrefCont = require('../../controllers/preference-controller')
const preferenceController = new PrefCont()

const GPrefCont = require('../../controllers/generalPreference-controller')
const gPreferenceController = new GPrefCont()

const auth = require('../../services/auth-service')
const ROLE = require('../../models/role')

router.post('', auth.validateUser([ROLE.ADMIN, ROLE.DEVELOPER])
  , preferenceController.savePreference)
router.get('', auth.validateUser([ROLE.ADMIN, ROLE.DEVELOPER])
  , preferenceController.getPreferences)

router.post('/general', auth.validateUser([ROLE.ADMIN, ROLE.DEVELOPER])
  , gPreferenceController.saveGeneralPreference)
router.get('/general', auth.validateUser([ROLE.ADMIN, ROLE.DEVELOPER])
  , gPreferenceController.getGeneralPreference)

module.exports = router
