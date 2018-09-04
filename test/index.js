import chai  from "chai";
import crawlerr from "../src/";

describe("crawlerr", function () {
  const expect = chai.expect;

  describe("spider", function () {
    describe(".get(uri)", function () {
      it("should handle promises", function () {
        let spider = crawlerr("https://google.com/");

        expect(spider.get("/")).to.have.property("then");
        expect(spider.get("/")).to.have.property("catch");
      });

      it("should handle a valid request", function (done) {
        let spider = crawlerr("https://google.com/");

        spider.get("/").then(({ req, res, uri }) => {
          expect(req).to.be.an("object");
          expect(res).to.be.an("object");
          expect(uri).to.equal("https://google.com/");
          done();
        });
      });

      it("should throw on not valid request", function (done) {
        let spider = crawlerr("https://google/");

        spider.get("/").catch(error => {
          expect(error).to.be.an.instanceof(Error);
          expect(error.message).to.be.a("string");
          expect(error.message.includes("ENOTFOUND google")).to.equal(true);
          done();
        });
      });
    });

    describe(".when(pattern)", function () {
      // it("should handle promises", function () {
      //   let spider = crawlerr("https://google.com/");
      //
      //   expect(spider.when("/")).to.have.property("then");
      //   expect(spider.when("/")).to.have.property("catch");
      // });

      it("should handle a valid request", function (done) {
        let spider = crawlerr("https://google.com/");

        spider.when("/", ({ req, res, uri }) => {
          spider.stop();

          expect(req).to.be.an("object");
          expect(res).to.be.an("object");
          expect(uri).to.equal("https://google.com/");
          done();
        });

        spider.start();
      });
    });
  });
});
