const fs = require("fs");
const url = require("url");
const http = require("http");
const path = require("path");
const Stream = require("stream").Transform;
const crawler = require("../dist");
const spider = crawler("http://placekitten.com/");

spider
  .get("/")
  .then(({ req, res, uri }) => {
    const document = res.document;
    const images = document.getElementsByTagName("img");

    for (const image of images) {
      const src = url.resolve(uri, image.src);
      console.log(`Downloading ${image.src} from ${uri} (${src})`);

      http
        .request(src, response => {
          const data = new Stream();
          const file = `${+new Date()}.jpg`;
          const src = path.resolve(__dirname, "./downloaded/", file);

          response.on("data", chunk => {
            data.push(chunk);
          });

          response.on("end", () => {
            console.log(`Saved as ${file} (${src})`);
            fs.writeFileSync(src, data.read());
          });
        })
        .end();
    }
  })
  .catch(error => {
    console.log(error);
  });
