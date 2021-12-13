// Since the code was written to run on a Web Browser for user simplicity
// testing platfforms for pure front are not available AFAIK
//Thus this test are written platfform-less

import * as functions from './functions.js';
import Player from './Models/Player.js';
import PlayerDuet from './Models/PlayerDuet.js';

export function runUnitTests()
{
    
    var testinput = getTestData();
    var testOutput = getTestOutputData();
    organizeDataTest(testinput,testOutput);
    searchMatchingPairTest(testOutput)
}

function getTestData()
{
    var player1 = {
        first_name: "Nate",
        h_in: 69,
        h_meters: "1.75",
        last_name: "Robinson"
    }
    var player2 = {
        first_name: "Brevin",
        h_in: 70,
        h_meters: "1.78",
        last_name: "Knight"
    }

    var player3 = 
    {
        first_name: "Kyle",
        h_in: 72,
        h_meters: "1.83",
        last_name: "Lowry"
    }


    return  { values: [player3, player1 ,player2]};
}

function getTestOutputData()
{
    var player1 = new Player ("Nate Robinson",69 );
    var player2 = new Player ("Brevin Knight",70);
    var player3 = new Player ("Kyle Lowry",72,);


    return   [player3, player1 ,player2];
}

function organizeDataTest(testArray, testOutput)
{
    var testMatrix = functions.organizeData(testArray)

    console.assert(testMatrix[69][0].name === testOutput[1].name,"Data not ordered correctly")
}


function searchMatchingPairTest(output)
{
    var testResponse = functions.searchMatchingPair(null,142);
    console.assert(testResponse[0].player1.name = output[2].name,"Data not ordered correctly");
     //clears the results container
     document.querySelector("tbody").innerHTML = "";

}




