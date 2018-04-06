const crawler = require("../dist");
const spider = crawler("http://google.com/");

spider
  .get("/")
  .then(({ req, res, uri }) => {
    console.log(`Title from ${uri}:`, res.document.title);
  })
  .catch(error => {
    console.log(error);
  });
