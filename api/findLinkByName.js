require('dotenv').config();

const Joi = require('joi');
const axios = require('axios');

const { findLinkByNameQuery } = require('../utils/queries');

const schema = Joi.object({
  name: Joi.string()
    .alphanum()
    .max(32),
});

async function findLink(name) {
  const res = await axios({
    url: 'https://graphql.fauna.com/graphql',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FAUNA_DB_KEY}`,
    },
    data: {
      query: findLinkByNameQuery,
      variables: { name },
    },
  });

  if (!res.data.errors) {
    return { ok: true, data: res.data.data.findLinkByName };
  }
  return { ok: false, data: res.data.errors[0].message };
}

module.exports = async (req, res) => {
  try {
    const { name } = await schema.validateAsync(JSON.parse(req.body));
    const link = await findLink(name);
    if (link.ok) {
      if (link.data) {
        res.send({ message: 'Found Link', link: link.data });
      } else {
        res.send({ message: 'Not Founded', link: {} });
      }
    } else {
      res.send({ message: 'Error', error: link.data });
    }
  } catch (error) {
    res.status(400).send({ message: 'Error', error: error.message });
    console.log('Error on server:', error.message);
  }
};
