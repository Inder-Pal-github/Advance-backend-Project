const createError = require("http-errors");
const clientId = "82a606ed745e334ba492";
const clientSecret = "f88942e137a6a67df3a00c06ad9ac691bbbbf5b9";
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
module.exports = {
  GitHubLogin: async (req, res, next) => {
    try {
      const { code } = req.query;
      console.log(code);
      let {access_token} = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
          }),
        }
      ).then((res) => res.json());
      console.log(access_token);
      const userDetails = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }).then((res) => res.json());
      console.log(userDetails);
      res.send(access_token);
    } catch (error) {
      next(error);
    }
  },
};
