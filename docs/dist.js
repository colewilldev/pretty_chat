// Copy These lines into the Chrome Dev Tools Console and then type prettify(); to prettify your chat thread!
console.log('You just Loaded the Prettify Script!');
console.log('Type in prettify(); to run it!');
function prettify(){
// Grabs the Chat HTML and returns it
function test(){
  return [].slice.call(document.getElementsByTagName('p')).find(el=>{
      if(el.dir =="auto" && el.innerText.length >300){
        return el;
      }
    })
  }
  console.log(test());
// adds the html to the function to prettify
var chat = test();

console.log('chat: ', chat);
  console.log('\n New Run Of Function');
  var inputHTML = chat.innerHTML;
// console.log(inputHTML.split('<br>'));
// console.log('TEXT: ', inputHTML);

var arrayOfSentences = inputHTML.split('<br>');

// console.log('Every Sentance of the Chat in an Array: ', arrayOfSentences);
var rawNameArray =[];
var eachLine = [];

// B UILDS EACH SENTENCE
arrayOfSentences.forEach((e,i)=>{
  // Print every line
	/* console.log(e); */
 
 	// console.log(e[0]);
  if(e[0]=="("){
    var time = e.slice(1,12);
    var rawName = e.slice(13, e.indexOf(': '));
    var sentence = e.slice(e.indexOf(': ') +2, e.length);
  
  var trimmedName = rawName.trim();
  if(rawNameArray.indexOf(trimmedName) < 0){
    rawNameArray.push(trimmedName);
  }
  if(trimmedName.includes('*** ')){
    trimmedName = 
    trimmedName.slice(trimmedName.indexOf('*** ')+ 4,trimmedName.indexOf('  joined'));
    // console.log('HERE!!!: ', trimmedName);
  }
  // Builds eachline into an array of objects
  eachLine.push({
  	'time': time,
    'name': trimmedName,
    'sentence': sentence
  })
}
}) // Build Each Sentence()

// console.log('Array of Sentence objects: ', eachLine[4]);
// console.log('Beginning filter functions!');

let empty_str_remove = (names) => names.filter((el)=>el !== "");

let rawNames2 = empty_str_remove(rawNameArray);
/* console.log('target: ',rawNames2); */

let removeDupes = (names) => names.filter((v,i)=>names.indexOf(v) === i);
let rawNames3 = removeDupes(rawNames2);

// Consolidates the name list, produces an array of names with their own hash list
let nameCheckArray = [];

for (var i=0; i < eachLine.length; i++){

  var obj = eachLine[i];

  rawNames3.forEach(el=>{
    let nameObj = {
        'nameString':'',
        'hash':[]
      };
 
    // see if the name includes numbers
    if(el.includes('is now known as')){
      // console.log(el);

      // take the left side
      var leftSide = el.slice(el[0],el.indexOf('is now known as')).trim();
      
      // take the right side
      var rightSide = el.slice(el.indexOf('is now known as ')+16, el.length-1).trim();
      // console.log('rightSide: ', rightSide);

      function isHash(name){
        return  /[0-9]/.test(name) && name.length > 35;
      }
      // console.log(i,`left: ${leftSide} <--> Right: ${rightSide}`);
      // console.log(i,`left: ${isHash(leftSide)} <--> Right: ${isHash(rightSide)}`);
      
      // console.log('condition: ', !isHash(leftSide) && isHash(rightSide));
      if(!isHash(leftSide) && isHash(rightSide)){
        nameObj.nameString = leftSide;
        nameObj.hash.push(rightSide);
      }
      if(isHash(leftSide)&& !isHash(rightSide)){
        nameObj.nameString = rightSide;
        // console.log('inserting: ', rightSide);
        
        nameObj.hash.push(leftSide);
      }
      // console.log('before push: ', nameObj);
      
      if(nameObj.nameString !== "" && nameCheckArray.length < 1){
        nameCheckArray.push(nameObj)
      }
      
      nameCheckArray.find(x =>{
        // console.log('1111111: ', x.nameString, x.nameString == nameObj.nameString, nameObj.nameString, );
        // console.log('HERE!!!: ', x.nameString);
        if((x.nameString != nameObj.nameString) && nameObj.nameString !== ""){
          nameCheckArray.push(nameObj)
        }
        
        if(x.nameString == nameObj.nameString){
          
          nameObj.hash.forEach(hashItem=> {
            
            if(x.hash.indexOf(hashItem)<0){
              x.hash.push(hashItem);
            }
          })
        }
      })   
    } // if "is known as"
  })
} // NAME CONSOLIDATOR end for loop

// Checks for Hash and replaces all hashes with the right name.
 console.log('nameCheckArray XXX: ', nameCheckArray);  
    nameCheckArray.forEach(obj=>{
      console.log('TEST TEST TEST: ', obj);
      obj.hash.forEach(hash =>{
        eachLine.find(line =>{
          
          if(line.name.includes(hash)){
            // console.log('999: ', obj.nameString);
            line.name = obj.nameString;
          }
        })
      })
    })
  let finalArr = [];

  // removes extra unecessary chat lines that have 'person is know known as...' 
  eachLine.forEach(line=>{
    if(line.sentence.indexOf(') ***')>0){
      
      line.sentence = ` *** Agent: ${line.name} has joined the chat *** `;
      console.log('Found one! ', line.sentence);
    }
    if(line.sentence.indexOf('is now known as') < 0){
      finalArr.push(line);
    } 
  })

  // ADD A CLASS FOR EACH Person in the chat for styling
  var namesList = [];
  eachLine.forEach(line=>{
    if(namesList.indexOf(line.name) < 0){
      namesList.push(line.name);
      console.log('namesList', namesList);
    }
  })

  var classObjArr = [];
  namesList.forEach((el,i)=>{
    classObjArr.push({
      'name': el,
      'css_class': 'agent_' + i
    });
  })
  // console.log('classObjArr', classObjArr);

  eachLine.forEach(line=>{

    classObjArr.find(el=>{
      if(el.name == line.name){
        // console.log('999: ', el);
        line.css_class = el.css_class; 
      }
    })
  })


  console.log('Final Chat Objects: ', finalArr);
  var names = [];
  var result = '';

  
  var names = [];

  // Adds the closing </div> tag at the end of the string
  var returnString  = '';
  // Builds the string that will become the final chat
  finalArr.forEach((line, index)=>{
    returnString += 
    `<div class="${line.css_class}">
      <span class="name">${index} ${line.name}</span>
      <span class="time">${line.time}</span>
      <span class="sentence">${line.sentence}</span>
    </div>`;
    })

  
  console.log('style: ', style);
  console.log('Final: ', returnString); // + style
// Extras for the Final rendered HTML
var fonts = `<link href="https://fonts.googleapis.com/css?family=Raleway|Source+Sans+Pro&display=swap" rel="stylesheet">`;

/// STYLE STLYE STYLE
var style = 
    `<style>
       .pretty_chat div{
     display: block;
     margin-bottom: 20px;
     padding: 20px;
     border-radius: 10px;
     box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
       0 6.7px 5.3px rgba(0, 0, 0, 0.048),
       0 12.5px 10px rgba(0, 0, 0, 0.06),
       0 22.3px 17.9px rgba(0, 0, 0, 0.072),
       0 41.8px 33.4px rgba(0, 0, 0, 0.086),
       0 100px 80px rgba(0, 0, 0, 0.12);
   }
   .pretty_chat .time {
     display: block;
     clear: both;
     font-size: 12px;
   }

   .pretty_chat .time {
     font-weight: bold;
   }

   .pretty_chat .name {
     font-size: 24px;
   }

   .pretty_chat .agent_0 {
     margin-left: 5px;
     display:inline-block;
     background-color: #4287f5;
     color: white;
     font-family: 'Source Sans Pro', sans-serif;
     font-size: 20px;
   }

   .pretty_chat .agent_1 {
     
     background-color: #F2C0FF ;
     font-size: 14px;
     font-family: 'Raleway', sans-serif;
   }
    </style>`;
///  INSERT YOUR OWN STYLES ABOVE

return [].slice.call(document.getElementsByTagName('p')).find(el=>{
      if(el.dir =="auto" && el.innerText.length > 500 ){
      el.innerHTML = `
        <div class="pretty_chat">
        <h1>Pretty Chat</h1>
          ${style}
          ${fonts}  
          ${returnString}
        </div>`;
      }
    })
});

