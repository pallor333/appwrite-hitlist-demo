import './style.css'
import { PROJECT_ID, DATABASE_ID, COLLECTION_ID } from './shhh.js';

import { Client, Databases, ID } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

const databases = new Databases(client);

const form = document.querySelector('form')
form.addEventListener('submit', addJob)

//Add entry the database
function addJob(e){
    e.preventDefault();
    const job = databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        { "company-name": e.target.companyName.value, 
          "date-added" : e.target.dateAdded.value, 
          "role" : e.target.role.value, 
          "location" : e.target.location.value,
          "position-type" : e.target.positionType.value,
          "source" : e.target.source.value
         }
    );
    job.then(function (response) {
        addJobsToDom()
    }, function (error) {
        console.log(error);
    });
    
    form.reset();
}

//Display to the webpage
async function addJobsToDom(){ 
    document.querySelector('ul').innerHTML = "";
    let response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID
    );
    //console.log(response.documents[0])
    response.documents.forEach((job)=>{
        const li = document.createElement('li')
        li.textContent = `${job['company-name']} | ${job['date-added']} | ${job['role']} |
        ${job['location']} | ${job['position-type']} | ${job['source']} coffee chat? ${job['chat']} `
        
        li.id = job.$id; //defining li id === document id

        //Delete button
        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = '🧨'
        deleteBtn.onclick = () => removeJob(job.$id)
        li.appendChild(deleteBtn)

        //coffee button
        const coffeeBtn = document.createElement('button')
        coffeeBtn.textContent = '☕'
        coffeeBtn.onclick = () => updateChat(job.$id)
        li.appendChild(coffeeBtn)

        document.querySelector('ul').appendChild(li)
    })

    //Delete from database
    async function removeJob(id){
        const result = await databases.deleteDocument(
            DATABASE_ID, // databaseId
            COLLECTION_ID, // collectionId
            id // documentId
        );
        document.getElementById(id).remove()
    }

    //Coffee Chat updater
    async function updateChat(id){
        const result = databases.updateDocument(
            DATABASE_ID, // databaseId
            COLLECTION_ID, // collectionId
            id, // documentId
            {'chat' : true}, // data (optional)
        );
        result.then(function(){location.reload()})//refresh the page
    }
}
addJobsToDom();
