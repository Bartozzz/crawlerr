const crawler = require("../dist");
const spider = crawler("http://example.com/");

spider
  .get("/")
  .then(({ req, res, uri }) => {
    const document = res.document;

    const title = document.getElementsByTagName("h1")[0];
    const text = document.getElementsByTagName("p")[0];

    console.log(`Fetching title and content from ${uri}`);
    console.log("Title:", title.innerHTML);
    console.log("Text:", text.innerHTML);
  })
  .catch(error => {
    console.log(error);
  });
