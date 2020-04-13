//links
//http://eloquentjavascript.net/09_regexp.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions


var messages = ["Chatbot: Where would you like to begin the trip (a city)?"], //array that hold the record of each string in chat
  lastUserMessage = "", //keeps track of the most recent input string from the user
  botMessage = "", //var keeps track of what the chatbot is going to say
  botName = 'Chatbot', //name of the chatbot
  talking = true; //when false the speach function doesn't work 
  startLocation = "";
  key = 'AIzaSyCPTkeSduuvYhMeAUi9p5bnjQ1SbETnUNg',
  places = [],
  addresses = [],
  time = [],
  startTime=0,
  response = 0;
const proxyurl = "http://ancient-garden-47770.herokuapp.com/";
  
//
//
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//edit this function to change what the chatbot says
function search() {
  talking = true;
  
  var x;
  var place;
  var address;
  var input1 = lastUserMessage.split();
  var input2 = startLocation.split();
  var inputs = input1.concat(input2);

  
  url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + inputs.join("%") + '&inputtype=textquery&fields=formatted_address,name&key=' + key; // site that doesn’t send Access-Control-*
  fetch(proxyurl + url)
    .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
    .then(response => response.json())
    .then(contents => x = ((contents)))
    //.then(() => console.log(x))
    //.then(() => console.log((x.candidates[0])["name"]))
    .then(() => place = (x.candidates[0])["name"])
    .then(() => address = (x.candidates[0])["formatted_address"])
    //.then(() => console.log(place))
    .then(() => botMessage = "I found " + place + " at " + address)
    .then((botMessage) => {
      console.log(botMessage);
      messages.push("<b>" + botName + ":</b> " + botMessage);
      places.push(place);
      addresses.push(address);
      
      messages.push("<b>" + botName + ":</b> " + "How long would you like to stay there? (minutes)");
      outputChat();
    })
  response = 3;  
  
}

function final(){
  var output = "";
  output=output+"Start time: " + startTime + "<br/>"
  for (var i = 0; i < addresses.length-1; i++) {
    var distance = "";
    var hour = 0;
    var time = startTime;
    var hour1 = 0;
    var min1 = 0 ;
    var q = 0;
    output=output+"Location "+(i+1)+": " +places[i]+"<br/>";
    output=output+"Time here: "+time[i] + " minutes <br/>";
    start = addresses[i].split();
    end = addresses[i+1].split();
    url="https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+ start.join("%")+"&destinations="+ end.join("%")+"&key="+key;
    fetch(proxyurl + url)
      .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
      .then(response => response.json())
      .then(contents => x = ((contents)))
      .then(() => distance = x.rows[0].elements[0]["distance"]["text"])
      .then(() => time = x.rows[0].elements[0]["duration"]["value"])
      .then(() => console.log(distance))
      .then(() => console.log(time))
      .then(() => {
        output=output+"Distance travelled: "+distance + "<br/>"
        hour = Math.trunc(time/60/60)
        min = Math.trunc((time/60/60-Math.trunc(time/60/60))*60)
        output=output + "Time taken: "+ Math.trunc(time/60/60) + " hours and "+Math.trunc((time/60/60-Math.trunc(time/60/60))*60) + " minutes. "+"<br/>"
        min1=min+ (time-Math.trunc(time))*100
        if (min1>60)
        {
          min1=min1-60;
          hour1 = hour1+1
        }
        
        time = Math.trunc(startTime)+hour+min1/100

        output = output+"New time: "+ time + "<br/>"
        output = output + "New location: " + places[q+1]
        q=q+1
        messages.push(output)
        outputChat()
      })

      console.log(output)
      outputChat()
  }

}




//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//
//
//
//this runs each time enter is pressed.
//It controls the overall input and output
function newEntry() {
  //if the message from the user isn't empty then run 
  if (document.getElementById("chatbox").value != "") {
    //pulls the value from the chatbox ands sets it to lastUserMessage    
    botMessage = "";
    lastUserMessage = document.getElementById("chatbox").value;
    //sets the chat box to be clear
    document.getElementById("chatbox").value = "";
    //adds the value of the chatbox to the array messages
    messages.push(lastUserMessage);
    
    if (response==4)
      {
        if (lastUserMessage=="y")
          {
            botMessage="Where would you like to go next?";
            response=2;
            messages.push("<b>" + botName + ":</b> " + botMessage);
            outputChat();
            return;
          }
        else{
          final();
          return;
        }
        
      }  

    if (response==3)
      {time.push(lastUserMessage);
      botMessage = "Would you like to continue? y/n (lower case only)";
      response = 4;}

    if (response==2)
    search();
    
    if (response ==1)
      {
        startTime=lastUserMessage;
        botMessage="Where would you like to start?";
        response =2;
      }
    if (startLocation == "") {
      startLocation = lastUserMessage;
      botMessage = "What time would you like to begin? (24 hour time please, hour.min)";
      response = 1;
    }
    if (botMessage!= "")
      messages.push("<b>" + botName + ":</b> " + botMessage);

    //Speech(lastUserMessage);  //says what the user typed outloud
    //sets the variable botMessage in response to lastUserMessage
    
    
    
    
    
    
    // says the message using the text to speech function written below
    //Speech(botMessage);
    //outputs the last few array elements of messages to html
    outputChat();
  }
}

function outputChat(){
  for (var i = -1; i < 8; i++) {
    if (messages[messages.length - i])
      document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
  }
}
//text to Speech
//https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
function Speech(say) {
  if ('speechSynthesis' in window && talking) {
    var utterance = new SpeechSynthesisUtterance(say);
    //msg.voice = voices[10]; // Note: some voices don't support altering params
    //msg.voiceURI = 'native';
    //utterance.volume = 1; // 0 to 1
    //utterance.rate = 0.1; // 0.1 to 10
    //utterance.pitch = 1; //0 to 2
    //utterance.text = 'Hello World';
    //utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }
}

//runs the keypress() function when a key is pressed
document.onkeypress = keyPress;
//if the key pressed is 'enter' runs the function newEntry()
function keyPress(e) {
  var x = e || window.event;
  var key = (x.keyCode || x.which);
  if (key == 13 || key == 3) {
    //runs this function when enter is pressed
    newEntry();
  }
  if (key == 38) {
    console.log('hi')
    //document.getElementById("chatbox").value = lastUserMessage;
  }
}

//clears the placeholder text ion the chatbox
//this function is set to run when the users brings focus to the chatbox, by clicking on it
function placeHolder() {
  document.getElementById("chatbox").placeholder = "";
}