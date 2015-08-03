PlayersList = new Mongo.Collection('players');
console.log("Hello world");
if(Meteor.isClient){
  //this code only runs on the client
  Meteor.subscribe('thePlayers');
  console.log("Hello Client");
  Template.leaderboard.helpers({
    'player': function(){
      var currentUserId = Meteor.userId();
      return PlayersList.find({}, {sort: {score: -1, name: 1}})
    },
    'selectedClass': function(){
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if(playerId == selectedPlayer){
        return "selected"
      }
    },
    'showSelectedPlayer': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne(selectedPlayer)
    }
  });
  Template.leaderboard.events({
    'click .player': function(){
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
    },
    'click .increment': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('modifyPlayerScore', selectedPlayer, 5);
    },
    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('modifyPlayerScore', selectedPlayer, -5);
    },
    'click .remove': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('removePlayer', selectedPlayer);
    }
  });
  Template.addPlayerForm.events({
    'submit form': function(event){
      event.preventDefault();
      var playerName = event.target.playerName.value;
      Meteor.call('insertPlayerData', playerName);
    }
  });
}
if(Meteor.isServer){
    Meteor.publish('thePlayers', function(){
      var currentUserId = this.userId;
      return PlayersList.find({createdBy: currentUserId})
    });
    Meteor.methods({
      'insertPlayerData': function(playerName){
        var currentUserId = Meteor.userId();
        PlayersList.insert({name: playerName, score: 0, createdBy: currentUserId})
      },
      'removePlayer': function(selectedPlayer){
        var currentId = Meteor.userId();
        PlayersList.remove({_id: selectedPlayer, createdBy: currentId});
      },
      'modifyPlayerScore': function(selectedPlayer, scoreValue){
        var currentId = Meteor.userId();
        PlayersList.update({_id: selectedPlayer, createdBy: currentId}, {$inc: {score: scoreValue}});
      }
    });
}
