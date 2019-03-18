/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  'GET /':                   { action: 'view-homepage-or-redirect' },
  'GET /welcome':            { action: 'dashboard/view-welcome' },
  'GET /commit':             { action: 'dashboard/view-commit' },

  'GET /rating':             { view:   'pages/rating', locals: {layout: 'layouts/layoutplain'} },
  'GET /faq':                { view:   'pages/faq' },
  'GET /legal/terms':        { view:   'pages/legal/terms' },
  'GET /legal/privacy':      { view:   'pages/legal/privacy' },
  'GET /contact':            { view:   'pages/contact' },
  'GET /score':              { action: 'view-score' },
  'GET /confirm':              { action: 'view-confirm' },

  'GET /signup':             { action: 'entrance/view-signup' },
  'GET /email/confirm':      { action: 'entrance/confirm-email' },
  'GET /email/confirmed':    { view:   'pages/entrance/confirmed-email' },
  'GET /getusername':        { action: 'dashboard/get-user-name' },

  'GET /login':              { action: 'entrance/view-login' },
  'GET /password/forgot':    { action: 'entrance/view-forgot-password' },
  'GET /password/new':       { action: 'entrance/view-new-password' },

  'GET /account':            { action: 'account/view-account-overview' },
  'GET /account/password':   { action: 'account/view-edit-password' },
  'GET /account/profile':    { action: 'account/view-edit-profile' },
  'GET /countmein/:eventid':          { controller: 'CountMeInController', action: 'show', skipAssets: true},
  'PUT /register-commitment':         { action: 'register-commitment' },
  'POST /event-lookup':                { action: 'event-lookup' },

  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the CloudSDK library.
  '/api/v1/account/logout':                           { action: 'account/logout' },
  'PUT   /api/v1/account/update-password':            { action: 'account/update-password' },
  'PUT   /api/v1/account/update-profile':             { action: 'account/update-profile' },
  'PUT   /api/v1/account/update-billing-card':        { action: 'account/update-billing-card' },
  'PUT   /api/v1/entrance/login':                        { action: 'entrance/login' },
  'POST  /api/v1/entrance/signup':                       { action: 'entrance/signup' },
  'POST  /api/v1/entrance/send-password-recovery-email': { action: 'entrance/send-password-recovery-email' },
  'POST  /api/v1/entrance/update-password-and-login':    { action: 'entrance/update-password-and-login' },
  'POST  /api/v1/deliver-contact-form-message':          { action: 'deliver-contact-form-message' },
  'POST  /api/v1/fulfilledlist':                         { action: 'fulfilledlist' },
  'POST  /api/v1/commitmentlist':                         { action: 'commitmentlist' },
  'POST  /api/v1/acceptoffer':                            { action: 'acceptoffer' },

  'POST  /registerFacebookIndividual': 'CommitmentController.registerFacebookIndividual' ,
  'POST  /captureEmail': 'CommitmentController.captureEmail',
  'POST  /captureFirstName': 'CommitmentController.captureFirstName',
  'POST  /captureLastName': 'CommitmentController.captureLastName',
  'POST  /capturePhoneNumber': 'CommitmentController.capturePhoneNumber',
  'POST  /SetIndividualAsHelper': 'CommitmentController.SetIndividualAsHelper' ,
  'POST  /SetIndividualAsEntrepreneur': 'CommitmentController.SetIndividualAsEntrepreneur' ,
  'POST  /CreateCommitment': 'CommitmentController.CreateCommitment' ,
  'POST  /IsValidEntrepreneur': 'CommitmentController.IsValidEntrepreneur' ,
  'POST  /ViewCommitments': 'CommitmentController.ViewCommitments' ,
  'POST  /isValidCommitmentDate': 'CommitmentController.isValidCommitmentDate' ,
  'POST  /PromptCommitmentComplete': 'CommitmentController.PromptCommitmentComplete' ,
  'POST  /AcceptCommitmentOffer': 'CommitmentController.AcceptCommitmentOffer' ,
  'POST  /RejectCommitmentOffer': 'CommitmentController.RejectCommitmentOffer' ,
  'POST  /AcceptCommitmentCompletion': 'CommitmentController.AcceptCommitmentCompletion' ,
  'POST  /RejectCommitmentCompletion': 'CommitmentController.RejectCommitmentCompletion' ,
  'POST  /GetReliabilityRating': 'CommitmentController.GetReliabilityRating' ,
  'POST  /printUserName' : 'CommitmentController.printUserName',
  'POST  /CommittmentList': 'CommitmentController.CommittmentList' ,
  'POST  /CheckRegistrationStatus': 'CommitmentController.CheckRegistrationStatus' ,
  'POST  /BlockchainRecord': 'CommitmentController.blockchainRecord' ,
  'POST  /GetReliabilityRatingUser': 'CommitmentController.GetReliabilityRatingUser' ,
  'POST  /GetCompleteUserList': 'CommitmentController.GetCompleteUserList' ,
  'POST  /GetIncompleteUserList': 'CommitmentController.GetIncompleteUserList' ,

  
  

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝
  '/terms':                   '/legal/terms',
  '/logout':                  '/api/v1/account/logout',

};
