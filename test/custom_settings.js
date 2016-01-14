var read = require('../'),
  chai = require('chai'),
  expect = chai.expect,
  should = chai.should();

var html = '';
describe('custom settings', function () {
  before(function () {
    html = '<title>read-art</title>' +
      '<body>' +
      '<div>' +
      '<div class="dv1"><p class="p1">hi, dude, I am readability (<b>aka read-art</b>)<foot>foot</foot></p></div>' +
      '<div class="dv2"><div class="p2">hey, dude, I am readability too</div></div>' +
      '<div class="dv3"><foo>hello</foo>, dude, I am readability too.</div>' +
      '</div>' +
      '</body>';
  });
  after(function () {
    html = '';
  });
  describe('by default', function () {
    it('should skip nothing', function (done) {
      read(html, {
        output: 'text'
      }, function (err, art) {
        should.not.exist(err);
        expect(art).to.be.an('object');
        art.content.should.contain('foot');
        art.content.should.contain('aka read-art');
        done();
      });
    });
  });
  describe('skipTags', function () {
    it('skip <b>', function (done) {
      read.use(function () {
        this.skipTags('b,x,y,z');
      });
      read(html, {
        output: 'text'
      }, function (err, art) {
        should.not.exist(err);
        expect(art).to.be.an('object');
        art.content.should.contain('hi');
        art.content.should.not.contain('aka read-art');

        read.use(function () {
          this.reset()
        });
        done();
      });
    });
    it('skip <b> but not skip <foot>', function (done) {
      read.use(function () {
        this.skipTags('b,x,y,z', true);
      });
      read(html, {
        output: 'text'
      }, function (err, art) {
        should.not.exist(err);
        expect(art).to.be.an('object');
        art.content.should.contain('foot');

        read.use(function () {
          this.reset()
        });
        done();
      });
    });
  });

  describe('regexps', function () {
    describe('append', function () {
      it('positive', function (done) {
        read.use(function () {
          this.regexps.positive(/dv2|p2/);
        });
        read(html, {
          output: 'text'
        }, function (err, art) {
          should.not.exist(err);
          expect(art).to.be.an('object');
          art.content.should.contain('hey');

          read.use(function () {
            this.reset()
          });
          done();
        });
      });

      it('negative', function (done) {
        read.use(function () {
          this.regexps.negative(/dv1/);
        });
        read(html, {
          output: 'text'
        }, function (err, art) {
          should.not.exist(err);
          expect(art).to.be.an('object');
          art.content.should.contain('hey');

          read.use(function () {
            this.reset()
          });
          done();
        });
      });

      it('unlikely', function (done) {
        read.use(function () {
          this.regexps.unlikely(/dv1|p1/);
        });
        read(html, {
          output: 'text'
        }, function (err, art) {
          should.not.exist(err);
          expect(art).to.be.an('object');
          art.content.should.contain('hey');

          read.use(function () {
            this.reset()
          });
          done();
        });
      });

      it('maybe', function (done) {
        read.use(function () {
          this.regexps.unlikely(/dv1/);
          this.regexps.maybe(/dv1/);
        });

        read(html, {
          output: 'text'
        }, function (err, art) {
          should.not.exist(err);
          expect(art).to.be.an('object');
          art.content.should.contain('hi');
          art.content.should.contain('hey');
          art.content.should.contain('hello');

          read.use(function () {
            this.reset()
          });
          done();
        });
      });

      it('div2p', function (done) {
        read.use(function () {
          this.regexps.div2p(/<foo/);
        });
        read(html, {
          output: 'text'
        }, function (err, art) {
          should.not.exist(err);
          expect(art).to.be.an('object');
          art.content.should.contain('hello');

          read.use(function () {
            this.reset()
          });
          done();
        });
      });
    });
    describe('override', function () {
      it('positive', function (done) {
        read.use(function () {
          this.regexps.positive(/dv2|p2/, true);
        });
        read(html, {
          output: 'text'
        }, function (err, art) {
          should.not.exist(err);
          expect(art).to.be.an('object');
          art.content.should.contain('hey');

          read.use(function () {
            this.reset()
          });
          done();
        });
      });

      it('negative', function (done) {
        read.use(function () {
          this.regexps.negative(/dv1|p1/, true);
        });
        read(html, {
          output: 'text'
        }, function (err, art) {
          should.not.exist(err);
          expect(art).to.be.an('object');
          art.content.should.contain('hey');

          read.use(function () {
            this.reset()
          });
          done();
        });
      });

      it('unlikely', function (done) {
        read.use(function () {
          this.regexps.unlikely(/dv1|p1/, true);
        });
        read(html, {
          output: 'text'
        }, function (err, art) {
          should.not.exist(err);
          expect(art).to.be.an('object');
          art.content.should.contain('hey');

          read.use(function () {
            this.reset()
          });
          done();
        });
      });

      it('maybe', function (done) {
        read.use(function () {
          this.regexps.unlikely(/dv1|p1/, true);
          this.regexps.maybe(/dv2|p2/, true);
        });
        read(html, {
          output: 'text'
        }, function (err, art) {
          should.not.exist(err);
          expect(art).to.be.an('object');
          art.content.should.not.contain('hi');
          art.content.should.contain('hey');
          art.content.should.contain('hello');

          read.use(function () {
            this.reset()
          });
          done();
        });
      });

      it('div2p', function (done) {
        read.use(function () {
          this.regexps.div2p(/<(div|foo)/, true);
        });
        read(html, {
          output: 'text'
        }, function (err, art) {
          should.not.exist(err);
          expect(art).to.be.an('object');
          art.content.should.contain('hi');
          art.content.should.contain('hey');
          art.content.should.contain('hello');

          read.use(function () {
            this.reset()
          });
          done();
        });
      });
    });
  });
});
