App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function(){
    return App.initWeb3();
  },

  initWeb3: function(){
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },
  
  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      instance.Transfer({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });

      instance.DistributeCreator({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
      
      instance.DistributeUser({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function(){

  },

  transfer: function() {
    var to = $('#idSelect').val();
    var val = $('#amount').val();
    if (App.contracts.Token.deployed().then(function(instance){
      var x=(uint)(100*val)
      return instance.transfer(to,x);
    })){
      console.log("transfer successful");
    }

    else {
      console.log("unable t transfer");
    }
  },

  distributeC: function() {
    var to = $('#idSelect').val();
    var val = $('#amount').val();
    if (App.contracts.Token.deployed().then(function(instance){
      var x=(uint)(100*val)
      return instance.distributeCreator(to,x);
    })) {
      console.log("distribution successful");
    }
    else{
      console.log("distribution unsuccessful");
    }
  },
  
  distributeU: function() {
    var to = $('#idSelect').val();
    var val = $('#amount').val();
    if (App.contracts.Token.deployed().then(function(instance){
      var x=(uint)(100*val)
      return instance.distributeUser(to,x);
    })) {
      console.log("distribution successful");
    }
    else{
      console.log("distribution unsuccessful");
    }
  },

  addU: function() {
    var id = $('#idU').val();
    if (App.contracts.Token.deployed().then(function(instance) {
      return instance.addUser(id);
    })) {
      console.log("User added successfully");
    }
    else{
      console.log("Unable to add user");
    }
  },

  addC: function() {
    var id = $('#idC').val();
    if (App.contracts.Token.deployed().then(function(instance) {
      return instance.addCreator(id);
    })) {
      console.log("Creator added successfully");
    }
    else{
      console.log("Unable to add creator");
    }
  }

};