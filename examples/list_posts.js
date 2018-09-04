const crawler = require("../dist");
const spider = crawler("http://blog.npmjs.org/");

spider.when("/post/[digit:id]/[all:slug]", ({ req, res, uri }) => {
  const id = req.param("id");
  const slug = req.param("slug").split("?")[0];

  console.log(`[Info] Saving post with id: ${id} (${slug})`);
});

spider.on("start", () => {
  console.log("Start event");
});

spider.on("end", () => {
  console.log("End event");
});

spider.on("error", error => {
  console.log(`[Error] ${error}`);
});

spider.on("request", url => {
  console.log(`[Success] ${url}`);
});

spider.start();
