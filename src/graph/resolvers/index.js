const deepAssign = require('deep-assign');
const { DateType, CursorType } = require('../custom-types');
const ImageRepo = require('../../repositories/image');

const advertiser = require('./advertiser');
const campaign = require('./campaign');
const user = require('./user');
const template = require('./template');
const publisher = require('./publisher');
const placement = require('./placement');
const contact = require('./contact');

module.exports = deepAssign(advertiser, campaign, user, template, publisher, placement, contact, {
  /**
   *
   */
  Date: DateType,
  Cursor: CursorType,

  /**
   *
   */
  Query: {
    /**
     *
     */
    ping: () => 'pong',

    /**
     *
     */
    signImageUpload: (root, { input }) => {
      const { name, type } = input;
      return ImageRepo.signUpload(name, type);
    },
  },
});
