
/**
 * The main logic of the application
 */


/*---------------------- Imports --------------------------*/

import Player from './Models/Player.js';
import PlayerDuet from './Models/PlayerDuet.js';
import { runUnitTests } from './Test.js';

/*---------------------- Global Variables --------------------------*/

/*Stores the sorted array of heights */
var NBASorted = [];
// Organized by height matrix used to do all the matching operations
var heightsMatrix = [];
//Minimun and maximun numbers that can be used as input. If not in range, 
//the input is not processed and No Results found message is given
var minDifference = 0;
var maxDifference = 0;

/*---------------------- Functions      --------------------------*/

/*
    Initializes the data necessary to operate the program
    - Downloads the data From  the NBA
    - Sorts the data by height so future searches can be done quicky
    - Sets the minimium and maximumm possible heights differences that can be achieved  to optimize searches
*/
window.onload = function ()
{
    runUnitTests();
    NBASorted = [];
    heightsMatrix = [];
    let dataURL = "https://mach-eight.uc.r.appspot.com/";
    let NBAData = downloadAndProcessData(dataURL);
    document.querySelector('#submitButton').addEventListener('click',searchMatchingPair)
    
}

/*
    Receives an URL to download the data from it in a JSON format.
    The function returns an array with the data received
    Sample info = https://mach-eight.uc.r.appspot.com/
*/
function downloadAndProcessData(urlToDownload)
{

    fetch(urlToDownload)
    .then(response => response.json())
    .then(data => 
        { organizeData(data); })
    .catch(err => {
        console.error('An error ocurred', err);
        alert("The service is not available. Please try again later or contact support at info@sample.com \n Error:" + err)
    });

}


/*
  Creates a sorted array called heightsArray  with the received data where each position has an arraylist with the players who have the 
  height corresponding to the index of NBASorted 
*/

export function organizeData(data)
{
    NBASorted = sortByHeight(data.values);
            
    if(NBASorted.length < 2)
    {
        
        alert("There are not enough players in the dataset to make a comparison");
        return; //the program exits
    }
    minDifference = parseInt(NBASorted[NBASorted.length-1].h_in) + parseInt(NBASorted[NBASorted.length-2].h_in);
    maxDifference = parseInt(NBASorted[1].h_in) + parseInt(NBASorted[0].h_in);  

    for (let i = 0; i < NBASorted.length; i++) 
    {
        let player = NBASorted[i];
        let newPlayer = new Player(player.first_name + " " + player.last_name,player.h_in);


        heightsMatrix[newPlayer.height]?  heightsMatrix[newPlayer.height].push(newPlayer):  heightsMatrix[newPlayer.height] = [newPlayer]  ;    
    }

    return heightsMatrix;

}

/*
    Takes a list Of players and returns an array sorted by the height of the players
    Sample Object:
        first_name: "Alex"
        h_in: "77"
        h_meters: "1.96"
        last_name: "Acker"
*/
function sortByHeight(unsortedList)
{
    return unsortedList.sort( (a,b)=> a.h_in - b.h_in);
}


/*
    takes a single integer input and print a list of all pairs of players
    whose height in inches adds up to the integer input to the application. If no
    matches are found, the application will print "No matches found"

    Loops trough the array finding the precise height required to make a match with other player
   once is found it makes all the possible non repeating matches betwwen the players 
    
*/
// function searchMatchingPair(targetHeight)
export function searchMatchingPair(event, targetValue)
{

    //clears the results container
    document.querySelector("tbody").innerHTML = "";


    var targetHeight = targetValue || parseInt(document.getElementById('numberInput').value);
    var response = [];

    //The number searched is either too small or too big
    if(targetHeight > minDifference || targetHeight < maxDifference )
    {
        populateResponse()
        return response;
    }
   

    heightsMatrix.forEach(firstPlayersSameHeight => 
    {
        var searchedPairHeight = targetHeight - firstPlayersSameHeight[0].height
   
        if(firstPlayersSameHeight[0].height > searchedPairHeight ) //if is an element we have already explored of the list
        {
            return; //information already procesed, continue to the next element
        }

        if(heightsMatrix[searchedPairHeight]) //if there are matching players with the required height
        {
            //It is a nested FOR, but don't fear, is o(1) for the list of matching players
            //because it only loops over the guaranteed pairs (meaning the ones whose sum is equal to the user's parameter)
            //it doesn't loop over non matching pairs
            for (let j = 0; j < firstPlayersSameHeight.length; j++) 
            {
                const firstPlayer = firstPlayersSameHeight[j];
                
                for (let matchingPlayer = 0; matchingPlayer < heightsMatrix[searchedPairHeight].length; matchingPlayer++) 
                {
                    //For when both players have the same height
                    if(firstPlayersSameHeight[0].height == searchedPairHeight)
                        matchingPlayer = j+1;


                    let secondPlayer = heightsMatrix[searchedPairHeight][matchingPlayer];


                    if(firstPlayer!==secondPlayer && secondPlayer)
                        response.push(new PlayerDuet(firstPlayer,secondPlayer))    //we found the pair, save it to the response
                }
                
            }
            
        }

    });

    populateResponse(response);

    console.log(response);

    return response;
}

/**
 * Iterates throught the response and displays it on the webpage
 * by using the template defined on index.html
 * @param {*} response 
 */
function populateResponse(response)
{
    var template = document.querySelector('#playersRow').content;
    var toInsert = document.querySelector("tbody");

    if(!response || !response.length ||response.length==0)
    {
        toInsert.innerHTML = "No Matches Found";
        return;
    }


    for (let i = 0; i < response.length; i++) 
        {
            const element = response[i];

            template.querySelector('.p1Name').textContent = element.player1.name
            template.querySelector('.p1Height').textContent = element.player1.height
            template.querySelector('.p2Name').textContent = element.player2.name
            template.querySelector('.p2Height').textContent = element.player2.height
            var clone = document.importNode(template, true);
            toInsert.appendChild(clone)

        }  
    
}
