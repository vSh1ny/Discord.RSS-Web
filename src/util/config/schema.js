const Joi = require('@hapi/joi')

const logSchema = Joi.object({
  destination: Joi.string().allow('').default(''),
  linkErrs: Joi.bool().strict().default(true)
})

const botSchema = Joi.object({
  token: Joi.string().strict().default('')
})

const databaseSchema = Joi.object({
  uri: Joi.string().strict().default('mongodb://localhost:27017/rss'),
  redis: Joi.string().strict().allow('').default(''),
  connection: Joi.object().default({})
})

const httpsSchema = Joi.object({
  enabled: Joi.bool().strict().default(false),
  privateKey: Joi.string().allow('').default('').when('enabled', {
    is: true,
    then: Joi.string().disallow('').required()
  }),
  certificate: Joi.string().allow('').default('').when('enabled', {
    is: true,
    then: Joi.string().disallow('').required()
  }),
  chain: Joi.string().allow('').default('').when('enabled', {
    is: true,
    then: Joi.string().disallow('').required()
  }),
  port: Joi.number().strict().default(443)
})

const webSchema = Joi.object({
  enabled: Joi.bool().strict().default(false),
  trustProxy: Joi.bool().strict().default(false),
  port: Joi.number().strict().default(8081),
  sessionSecret: Joi.string().allow('').default('').when('enabled', {
    is: true,
    then: Joi.string().disallow('').required()
  }),
  redirectURI: Joi.string().allow('').default('').when('enabled', {
    is: true,
    then: Joi.string().disallow('').required()
  }),
  clientID: Joi.string().allow('').default('').when('enabled', {
    is: true,
    then: Joi.string().disallow('').required()
  }),
  clientSecret: Joi.string().allow('').default('').when('enabled', {
    is: true,
    then: Joi.string().disallow('').required()
  }),
  https: httpsSchema.default(httpsSchema.validate({}).value)
})

const schema = Joi.object({
  log: logSchema.default(logSchema.validate({}).value),
  bot: botSchema.default(botSchema.validate({}).value),
  database: databaseSchema.default(databaseSchema.validate({}).value),
  web: webSchema.default(webSchema.validate({}).value)
})

module.exports = {
  defaults: schema.validate({}).value,
  validate: config => {
    const results = schema.validate(config, {
      abortEarly: false
    })
    if (results.error) {
      const str = results.error.details
        .map(d => d.message)
        .join('\n')

      throw new TypeError(`Config validation failed\n\n${str}\n`)
    }
  }
}