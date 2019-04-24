/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {"confirmEmail":{"verb":"GET","url":"/email/confirm","args":["token"]},"getUserName":{"verb":"GET","url":"/getusername","args":[]},"show":{"verb":"GET","url":"/countmein/:eventid"},"registerCommitment":{"verb":"PUT","url":"/register-commitment","args":["event","prefName","emailAddress","phone","password"]},"eventLookup":{"verb":"POST","url":"/event-lookup","args":["event"]},"logout":{"verb":"GET","url":"/api/v1/account/logout","args":[]},"updatePassword":{"verb":"PUT","url":"/api/v1/account/update-password","args":["password"]},"updateProfile":{"verb":"PUT","url":"/api/v1/account/update-profile","args":["fullName","emailAddress"]},"updateBillingCard":{"verb":"PUT","url":"/api/v1/account/update-billing-card","args":["stripeToken","billingCardLast4","billingCardBrand","billingCardExpMonth","billingCardExpYear"]},"login":{"verb":"PUT","url":"/api/v1/entrance/login","args":["emailAddress","password","rememberMe"]},"signup":{"verb":"POST","url":"/api/v1/entrance/signup","args":["emailAddress","password","fullName"]},"sendPasswordRecoveryEmail":{"verb":"POST","url":"/api/v1/entrance/send-password-recovery-email","args":["emailAddress"]},"updatePasswordAndLogin":{"verb":"POST","url":"/api/v1/entrance/update-password-and-login","args":["password","token"]},"deliverContactFormMessage":{"verb":"POST","url":"/api/v1/deliver-contact-form-message","args":["emailAddress","topic","fullName","message"]},"fulfilledlist":{"verb":"POST","url":"/api/v1/fulfilledlist","args":["messengeruserid"]},"commitmentlist":{"verb":"POST","url":"/api/v1/commitmentlist","args":["eventid"]},"incompletelist":{"verb":"POST","url":"/api/v1/incompletelist","args":["messengeruserid"]},"pendinglist":{"verb":"POST","url":"/api/v1/pendinglist","args":["messengeruserid"]},"reliabilityrating":{"verb":"POST","url":"/api/v1/reliabilityrating","args":["messengeruserid"]},"acceptoffer":{"verb":"POST","url":"/api/v1/acceptoffer","args":["commitmentID"]},"eventlist":{"verb":"POST","url":"/api/v1/eventlist","args":[]}}
  /* eslint-enable */

});
