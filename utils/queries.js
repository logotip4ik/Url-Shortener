module.exports = {
  createLinkQuery: `
    mutation($name: String!, $url: String!, $createdAt: String!, $updatedAt: String! ) {
    createLink( data: { name: $name, url: $url, createdAt: $createdAt, updatedAt: $updatedAt }) {
      _id,
      name,
      url,
    }
  }`,
};
