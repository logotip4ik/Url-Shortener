const axios = require('axios');

const { findLinkByNameQuery } = require('../utils/queries');

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
  const { slug } = req.query;
  const link = await findLink(slug);
  if (!link.data) {
    res.redirect('/');
  } else {
    res.redirect(link.data.url);
  }
};
