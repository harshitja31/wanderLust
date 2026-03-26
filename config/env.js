const Joi = require("joi");

const envSchema = Joi.object({
    NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
    PORT: Joi.number().default(8080),
    ATLAS_DB: Joi.string().required().messages({
        "any.required": "ATLAS_DB is required in your .env file."
    }),
    CLOUD_NAME: Joi.string().required().messages({
        "any.required": "CLOUD_NAME is required in your .env file."
    }),
    CLOUD_API_KEY: Joi.string().required().messages({
        "any.required": "CLOUD_API_KEY is required in your .env file."
    }),
    CLOUD_API_SECRET: Joi.string().required().messages({
        "any.required": "CLOUD_API_SECRET is required in your .env file."
    }),
    MAP_TOKEN: Joi.string().required().messages({
        "any.required": "MAP_TOKEN is required in your .env file."
    }),
    SECRET: Joi.string().required().messages({
        "any.required": "SECRET is required in your .env file."
    })
}).unknown(); // Allow other environment variables to exist unvalidated

const { error, value } = envSchema.validate(process.env);

if (error) {
    console.error(`\n❌ Environment Variable Error: ${error.message}\n`);
    process.exit(1);
}

// Ensure defaults are assigned back to process.env if needed
if (!process.env.PORT) {
    process.env.PORT = value.PORT;
}

module.exports = value;
