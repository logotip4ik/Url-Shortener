require('dotenv').config();

const axios = require('axios');
const crypto = require('crypto');
const Joi = require('joi');

const { createLinkQuery } = require('../utils/queries');

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

async function createLink(link) {
  const date = new Date().toUTCString();
  const data = { ...link, createdAt: date, updatedAt: date };
  const createdLink = await axios({
    url: 'https://graphql.fauna.com/graphql',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FAUNA_DB_KEY}`,
    },
    data: {
      query: createLinkQuery,
      variables: data,
    },
  });

  if (!createdLink.data.errors) {
    return { ok: true, data: createdLink.data.data.createLink };
  }
  return { ok: false, data: createdLink.data.errors[0].message };
}

module.exports = async (req, res) => {
  try {
    const obj = await schema.validateAsync(JSON.parse(req.body));
    if (!obj.name) obj.name = genKey();
    const link = await createLink(obj);
    if (!link.ok) {
      res.status(400).send({ message: 'Error', error: link.data });
      return;
    }
    res.send({ message: 'Created Link', link: link.data });
  } catch (error) {
    res.status(400).send({ message: 'Error', error: error.message });
    console.log(error.message);
  }
};
