var proxyquire = require('proxyquire'),
    sinon = require('sinon'),
    assert = require('assert'),
    models = require('../../lib/models');

describe('utils', function(){
  describe('#formatObject', function(){
    it('return obj with only allowed attributes in correct order', function(){

      var strict_obj = {
            a: undefined,
            b: undefined,
            c: {
              d: undefined
            }
          },
          to_format = {
            d: 'd',
            c: {
              e: 'e',
              d: 'd',
              f: 'f'
            },
            b: 'b',
            a: 'a'
          },
          expected = {
            a: 'a',
            b: 'b',
            c: {
              d: 'd'
            }
          };

      assert.notDeepEqual(Object.keys(to_format), Object.keys(strict_obj));
      assert.notDeepEqual(to_format, expected);

      var result = require('../../lib/utils').formatObject(to_format, strict_obj);

      assert.deepEqual(result, expected);
      assert.deepEqual(Object.keys(result), Object.keys(strict_obj));
    });
  });

  describe('build XML helpers', function(){
    var sandbox,
        xml2js,
        fn_buildObj,
        formattedObj,
        fn_formatObject,
        mp_utils
    ;

    before(function(){
      sandbox = sinon.sandbox.create();

      fn_buildObj = sandbox.spy();
      xml2js = {
        Builder: sandbox.spy(function(){
          return {buildObject: fn_buildObj};
        })
      };

      mp_utils = proxyquire('../../lib/utils', {'xml2js': xml2js});

      formattedObj = 'formattedObj';
      fn_formatObject = sandbox.stub(mp_utils, 'formatObject');
      fn_formatObject.returns(formattedObj);
    });

    after(function(){
      sandbox.restore();
    });

    it('#buildAddCustomerXML', function() {
      var data = {'data': 'data'},
          auth = {'auth': 'auth'},
          xmlOpts = {'opt': 'opt'};

      mp_utils.buildAddCustomerXML(data, auth, xmlOpts);

      assert.ok(fn_formatObject.calledOnce);
      assert.ok(fn_formatObject.calledWithExactly(data, models.addCustomer));

      assert.ok(xml2js.Builder.calledOnce);
      assert.ok(xml2js.Builder.calledWithExactly(xmlOpts));

      assert.ok(fn_buildObj.calledOnce);
      assert.ok(fn_buildObj.calledWithExactly({
        'api-request': {
          verification: auth,
          command: 'add-consumer',
          request: formattedObj
        }
      }));
    });

  });
});

