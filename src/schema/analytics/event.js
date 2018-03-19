const { Schema } = require('mongoose');
const UAParser = require('ua-parser-js');
const Utils = require('../../utils');

const browserSchema = new Schema({
  name: String,
  version: String,
  major: String,
}, { _id: false });

const engineSchema = new Schema({
  name: String,
  version: String,
}, { _id: false });

const osSchema = new Schema({
  name: String,
  version: String,
}, { _id: false });

const deviceSchema = new Schema({
  vendor: String,
  model: String,
  type: String,
}, { _id: false });

const uaSchema = new Schema({
  ua: String,
  browser: browserSchema,
  engine: engineSchema,
  os: osSchema,
  device: deviceSchema,
}, { _id: false });

const schema = new Schema({
  e: {
    type: String,
    required: true,
    enum: ['request', 'load', 'view', 'click'],
  },
  uuid: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return Utils.uuid.is(v);
      },
      message: 'Invalid UUID for {VALUE}',
    },
  },
  pid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  cid: {
    type: Schema.Types.ObjectId,
  },
  d: {
    type: Date,
    required: true,
  },
  bot: {
    type: String,
  },
  ua: {
    type: uaSchema,
    set(v) {
      if (!v) return undefined;
      const parser = new UAParser();
      parser.setUA(v);
      return parser.getResult();
    },
  },
  ref: {
    // Will appear on all events except requests.
    type: String,
  },
  kv: {
    // Will only appear on requests.
    type: Schema.Types.Mixed,
    /**
     * @todo Eventually this needs to limited by keys that are acceptable (in the database).
     */
    set: kv => Utils.cleanValues(kv),
  },
});

module.exports = schema;
