$(document).ready(function() {

  var config = {
    apiKey: "AIzaSyAm7D7bclYwNNx65KNSMF1eR2ccFe6sYAs",
    authDomain: "train-station-557dc.firebaseapp.com",
    databaseURL: "https://train-station-557dc.firebaseio.com",
    projectId: "train-station-557dc",
    storageBucket: "train-station-557dc.appspot.com",
    messagingSenderId: "277456015268"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var train = "";
  var destination = "";
  var trainTime = "";
  var frequency = "";
  var newRow = "";
  var nextArrival = "";
  var minutesAway = "";
  var currentTime = moment();
  var momentNextArrival = moment(nextArrival);


  $("#addTrain").on("click", function() {
    // Don't refresh the page!
    event.preventDefault();

    train = $("#trainName").val().trim();
    destination = $("#trainDestination").val().trim();
    trainTime = $("#militaryTime").val().trim();
    frequency = $("#frequencyId").val().trim();

    var trainTimeConverted = moment(trainTime, "hh:mm").subtract("1, years");
    var difference = currentTime.diff(moment(trainTimeConverted), "minutes");
    var remainder = difference % frequency;
    var minUntilTrain = frequency - remainder;
    var nextTrain = moment().add(minUntilTrain, "minutes").format("hh:mm a");


    // Change what is saved in firebase
    database.ref("/trainStation").push({
      train: train,
      destination: destination,
      trainTime: trainTime,
      frequency: frequency,
      minutesAway: minUntilTrain,
      nextArrival: nextTrain
    });

    $("#trainName").val("");
    $("#trainDestination").val("");
    $("#militaryTime").val("");
    $("#frequencyId").val("");

  });

  database.ref("/trainStation").on("child_added", function(snapshot) {
    train = snapshot.val().train;
    destination = snapshot.val().destination;
    trainTime = snapshot.val().trainTime;
    frequency = snapshot.val().frequency;
    var minutesAway = snapshot.val().minutesAway;
    var nextArrival = snapshot.val().nextArrival;


    newRow = "<tr><td>" + train + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>";
    $("#table-body").append(newRow);


  });
});
