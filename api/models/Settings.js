/**
 * Settings.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    privKey: {
      type: 'string',
      description: 'Private key for signing transactions',
    },
    emailPass: {
      type: 'string',
      description: 'Email password for SMTP transactions',
    },

  }
};

