const https= require ('https');
var express = require('express');
app=express();
var axios = require('axios');

var getJSON = require('get-json')


const request = require('request');
const fetch = require('node-fetch');
// This is a rest api built using express library that is used by frontend The "query" contains the name of the medicine we want to fetch the results for. 
//The fn is of the form request, response where upon recieving a trigger The request will contain the request body(including query)
//the response will be sent after getting the objects from the functions  
//Additinal res- 
//What is express- Used to create api in nodeJS (https://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm)
//What is nodeJS- Used to build backends, Single threaded,Asynchronous (does not wait for objects to return) unlike C++, java  (https://www.tutorialspoint.com/nodejs/index.htm)

app.get('/:query',function(req, res)  {   
    
  (async() => {
    //Promise is returned first from callmeds
    var promiseFromCallMeds = await callmeds(req);
    //We get an array of hashmaps from callmeds after awaiting on the promise returned by it 
    var resultFromCallMeds = await promiseFromCallMeds;
    //The below lines are just console data.
    if(resultFromCallMeds[0].Available){
         
         console.log("object "+JSON.stringify(resultFromCallMeds[0]));
    }
         if(resultFromCallMeds[1].Available){
        
          console.log("object "+JSON.stringify(resultFromCallMeds[1]));
         }
          if(resultFromCallMeds[2].Available){
      console.log("object "+JSON.stringify(resultFromCallMeds[2]));
      }
        if(resultFromCallMeds[3].Available){
    
            console.log("object "+JSON.stringify(resultFromCallMeds[3]));
        }
    
            res.header("Access-Control-Allow-Origin", "*");
            res.send(resultFromCallMeds)
     res.end();

  })();
     
});   
app.get('/check/:query',function(req, res)  {   
    
  let settings = { method: "Get" ,
  headers: {
    "content-type": "application/json",
    }
};
  var url ='https://localhost:5001/'+req.params.query;
var s=  (async()=>{ fetch(url, settings)
      .then(resq => resq.json())
      .then((json) => {
        
        });
        })();
       res.send(s);
     res.end();
    
  
});
// callmeds recieves the request body(contains medicine name) and sends this to different functions where requests are made to the backend of these online pharmacies 
//and json objects are returned we parse these json objects by passing them to parser functions and push the hashmap returned from these parsers to an array.
//This array is then returned which is ultimately the response of our backend.
async function callmeds(req){
  console.log("Inside function callmeds");
  var arr=new Array();
   var ph =Object.fromEntries(await jsonParserpharmeasy((await pharmeasy(req.params.query))));
   var p =Object.fromEntries(await jsonParserPracto((await practo1(req.params.query))));
    var m =Object.fromEntries(await jsonParserMedlife((await medlife(req.params.query))));
  var n =Object.fromEntries(await(jsonParserNetMeds (await netmeds1(req.params.query))));
  arr.push(ph);
    arr.push(p);
    arr.push(m);
    arr.push(n);
 

  return arr;
}
//Triggered from callmeds recieves a string(medicine name ) and is used to create api request to netmeds backend, which unlike other websites uses post request to return search result.
async function netmeds1(query){

  var url ='https://3yp0hp3wsh-dsn.algolia.net/1/indexes/*/queries?'+
  'x-algolia-agent=Algolia%20for%20JavaScript%20(3.33.0)%3B%20Browser%3B%20instantsearch.js%20(4.4.0)%3B%20JS%20Helper%20(3.1.1)&x-algolia-application-id=3YP0HP3WSH&x-algolia-api-key=b7a2d287855abb4d0a80a1cbe9567ba9';
  var headers = {
    "Content-Type": "application/json"
  }
  var data=
 JSON.stringify({ "requests": [
    {
        "indexName": "prod_meds",
        "params": "clickAnalytics=true&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&query="+query+"&hitsPerPage=10&facets=%5B%5D&tagFilters="
    }
]
})
  
  return await fetch(url,{method :'POST',headers:headers,body:data})
  .then(res => res.json())
  .then((json) => {
      
      return json;
  });
  }
//Triggered from callmeds recieves a string(medicine name ) and is used to create api request to pharmeasy backend, simple GET request to fetch json
async function pharmeasy(query){
  let settings = { method: "Get" };
  var url ='https://pharmeasy.in/api/search/search/?q='+query+'&page=1';
return await fetch(url,settings)
      .then(res => res.json())
      .then((json) => {
        return json;
      });
} 
//Triggered from callmeds recieves a string(medicine name ) and is used to create api request to practo backend, simple GET request to fetch json

async function practo1(query){
    var url ='https://www.practo.com/practopedia/api/v1/search?query='+query+'&pincode=560009';
    return await getJSON(url, function(error, response){    
    });
}
 


 //Triggered from callmeds recieves a string(medicine name ) and is used to create api request to medlife backend, simple GET request to fetch json

async function medlife(query){
        var url ='https://rest.medlife.com/api/v1/search-micro-service/product-search/self-digitize/'+query+'?fcID=BLR13&pincode=560029&fcType=MEDLIFE_FC&mode=user';
    return await    getJSON(url, function(error, response){
           
      });
     
    }
app.listen(5001, '127.0.0.1');
console.log('Node server running on port 5001');

//Takes in the json object returned from Practo backend and processes them to return hashmap(key , value pair)
async function jsonParserPracto(stringValue) {

  
  // Add keys to the hashmap
    var n=stringValue.length;
    var i=0;
    while(i<n){

  //      console.log(stringValue[i].type.localeCompare("drug_combination"));
        if (stringValue[i].type.localeCompare("drug_combination")){
                if(stringValue[i].drug.is_available==true){
                break;
                }     
        }
           i++;
    }

  var elements=new Map();
  var j=0;
  if(i==n){
    elements.set("Available",false);
    return elements;
  }
  elements.set("Available",true);

        elements.set("OTC", (stringValue[i].drug.requires_prescription));
        elements.set(  "Drug_Name", (stringValue[i].drug.product_name) );
    if(stringValue[i].drug.hasOwnProperty("images"))
        elements.set("Photo", ( (stringValue[i].drug.images[0].res-150)));
        elements.set("Price", (stringValue[i].drug.mrp) );
        elements.set("real_Price", ((stringValue[i].drug.mrp)- (stringValue[i].drug.mrp*stringValue[i].drug.discount)/100));
        elements.set("Link","https://www.practo.com/medicine-info/"+stringValue[i].drug.slug);
    
 return (elements);
}
//Takes in the json object returned from MEdlife backend and processes them to return hashmap(key , value pair)

function jsonParserMedlife(stringValue) {

    // Add keys to the hashmap
      var n=stringValue.medicineList.length;
      var i=0;
      var elements=new Map();
    //
     // console.log("value "+JSON.stringify(stringValue.medicineList));
      if(n==0||n==undefined){
        console.log("false "+n);
        elements.set("Available",false);
          return elements;

      }
      elements.set("Available",true);
          elements.set("OTC", (stringValue.medicineList[0].rxDrug));
          elements.set("Drug_Name", (stringValue.medicineList[0].brandDesc));
          elements.set("Photo", (stringValue.medicineList[0].thumbnailURL));
          elements.set("Price", (stringValue.medicineList[0].mrp));
          elements.set("real_Price", (stringValue.medicineList[0].sellingPrice));
      
   return (elements);
}
//Takes in the json object returned from NetMeds backend and processes them to return hashmap(key , value pair)

function jsonParserNetMeds(stringValue) {
     
      var n=stringValue.results[0].hits.length;
       var i=0;
      var elements=new Map();
      console.log
while(i<n){
  if(  (stringValue.results[0].hits[i].availability_status).localeCompare("A")==0)
    break;
   i++; 
}

if(i==n){
  elements.set("Available",false);
  return elements;
}
elements.set("Available",true);
   console.log(stringValue.results[0].hits[i].availability_status);
           elements.set("OTC", (stringValue.results[0].hits[i].rx_required));
           elements.set("Drug_Name", (stringValue.results[0].hits[i].display_name));
           elements.set("Photo", (stringValue.results[0].hits[i].thumbnail_url));
           elements.set("Price", (stringValue.results[0].hits[i].mrp));
           elements.set("real_Price", (stringValue.results[i].hits[0].selling_price));
           elements.set("Link", "https://www.netmeds.com/prescriptions/"+(stringValue.results[0].hits[i].url_path));
           console.log("parser "+i);
      
   return (elements);
} 
//Takes in the json object returned from pharmeasy backend and processes them to return hashmap(key , value pair)

async function jsonParserpharmeasy(stringValue) {

var i=0;
var elements=new Map();
var b=stringValue.data.products;
var n=b.length;
while(i<n){
if(  (b[i].productAvailabilityFlags.isAvailable))
break;
i++; 
}
if(i==n){
  elements.set("Available",false);
  return elements;
}
elements.set("Available",true);


 if(b[i].entityType==1)
 elements.set("OTC", false);
    else
 elements.set("OTC", true);

 elements.set("Drug_Name", (b[i].name));
 elements.set("Link", ("https://pharmeasy.in/online-medicine-order/"+b[i].slug));

 elements.set("Price", (b[i].mrpDecimal));
 elements.set("real_Price", (b[i].salePriceDecimal));

return(elements);
}
