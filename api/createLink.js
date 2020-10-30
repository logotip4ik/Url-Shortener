const crypto = require('crypto');
const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string()
    .allow(null, '')
    .alphanum()
    .max(32),
  url: Joi.string()
    .uri()
    .required(),
});

function genKey() {
  const key = crypto
    .randomBytes(8)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  console.log(key);
  return key;
}

module.exports = async (req, res) => {
  try {
    const obj = await schema.validateAsync(JSON.parse(req.body));
    if (!obj.name) obj.name = genKey();
    res.send({ message: 'Created Link', link: obj });
  } catch (error) {
    res.status(400).send({ message: 'Error', error: error.message });
    console.log(error.message);
  }
};
