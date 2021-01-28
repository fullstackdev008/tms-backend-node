/**
 * Index router file
 *
 * @package   backend/src/routes
 * @author    DongTuring <dong@turing.com>
 * @author    WangTuring <wangwang@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly
 */

const express = require('express')
const router = express.Router()

const apiAuthRouter = require('./auth')
const apiLandingPageRouter = require('./landingpage')
const apiSubmitRouter = require('./submit')
const apiSaveTestResult = require('./test-board')
const apiDashboardRouter = require('./dashboard')
const apiGeneralRouter = require('./general')
const apiSocialAuthRouter = require('./social-auth')
const apiCliRouter = require('./cli')
const apiMailRouter = require('./mail')
const apiVisitorRouter = require('./visitor')
const apiStatsRouter = require('./stats')
const userRouter = require('./user');

/**
 * Authentication page API router
 */
router.use('/auth', apiAuthRouter)

/**
 * Landing Page API router
 */
router.use('/landingpage', apiLandingPageRouter)

/**
 * Submit page API router
 */
router.use('/submit', apiSubmitRouter)

/**
 * Test result page API router
 */
router.use('/board', apiSaveTestResult)

/**
 * Dashboard page API router
 */
router.use('/dashboard', apiDashboardRouter)

/**
 * General API router
 */
router.use('/general', apiGeneralRouter)
/*
 * Social auth API router
 */
router.use('/social-auth', apiSocialAuthRouter)
/**
 * Cli API router
 */
router.use('/cli', apiCliRouter),
/**
 * Cli API router
 */
router.use('/mail', apiMailRouter)
/**
 * Visitor API router
 */
router.use('/visitor', apiVisitorRouter)
/**
 * Stats API router
 */
router.use('/stats', apiStatsRouter)
/**
 * User API router
 */
router.use('/user', userRouter);

/* dv2_temporary_solution */
require('../dv2_temporary_solution/routes/common').expose(router);
require('../dv2_temporary_solution/routes/problem').expose(router);
require('../dv2_temporary_solution/routes/challenge').expose(router);
require('../dv2_temporary_solution/routes/job').expose(router);
require('../dv2_temporary_solution/routes/checkValid').expose(router);
require('../dv2_temporary_solution/routes/score').expose(router);
/* End dv2_temporary_solution */

module.exports = router
