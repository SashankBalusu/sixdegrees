import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDL87yvqfuYgkRdgjrVPDt9wMsqT6cCkOs",
    authDomain: "degrees-bb9bf.firebaseapp.com",
    projectId: "degrees-bb9bf",
    storageBucket: "degrees-bb9bf.appspot.com",
    messagingSenderId: "802908007191",
    appId: "1:802908007191:web:ae55d4bc12eb7288852552"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

//select user info buttons
const addConnection = document.getElementById("addConnection")
const delConnection = document.getElementById("delConnection")
const submitConnection = document.getElementById("submitConnection")

//select content spaces
const namesCon = document.getElementById("namesCon")
const graphCon = document.getElementById("groupCon")

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)
const groupName = urlParams.get("group")

function createGraph(){
    let groupInfo
    let people = []
    get(ref(database, "groups/" + groupName)).then((info) => {
        if ((info.exists())){
            groupInfo = info.val()
            delete groupInfo["groupName"]
            for (let key in groupInfo){
                let connFromDb = groupInfo[key]["people"]
                for (let i = 0; i < connFromDb.length; i++){
                    people.push([key, connFromDb[i]])
                
                    Highcharts.chart('graphCon', {
                
                    chart: {
                        type: 'networkgraph',
                        marginTop: 80,
                        backgroundColor: 'transparent',
                        style: {
                            fontFamily: 'Franklin Gothic Medium',
                        }

                    },
                    credits: {
                        enabled: false
                    },
                
                    title: {
                        text: `Connections for group '${groupName}'`,
                        style: {
                            color:"white",
                            fontSize: '30px',
                            fontWeight: "bold"
                            
                        }
                    },
                
                    plotOptions: {
                        networkgraph: {
                        keys: ['from', 'to'],
                        layoutAlgorithm: {
                            enableSimulation: true,
                            integration: 'verlet',
                            linkLength: 100
                        }
                        }
                    },
                
                    series: [{
                        marker: {
                        radius: 13,
                        },
                        dataLabels: {
                        enabled: true,
                        linkFormat: '',
                        allowOverlap: true
                        },
                        color:"white",
                        link: {
                            color: "white"
                        },
                        data: people,
                    }]
                    });
                }
            }
            console.log(people)

          
          
        }
        
    }).catch((error) => {
          console.error(error);
    });
    

}
createGraph()

addConnection.addEventListener("click", function(){
    let input = document.createElement("input")
    input.type = "text"
    input.classList.add("connectionInput")
    input.required = true
    let label = document.createElement("label")
    label.setAttribute("alt", "Connection")
    label.setAttribute("placeholder", "Connection")
    console.log(label)
    namesCon.insertBefore(label, namesCon.children[namesCon.children.length-4]);
    namesCon.insertBefore(input, namesCon.children[namesCon.children.length-4]);

})
delConnection.addEventListener("click", function(){
    console.log(namesCon.children.length)
    if (namesCon.children.length == 7){
        return
    }
    namesCon.removeChild(namesCon.children[namesCon.children.length-5])
    namesCon.removeChild(namesCon.children[namesCon.children.length-5])

})
submitConnection.addEventListener("click", function(){
    
    console.log(groupName)
    const username = document.getElementById("username")
    const user = username.value.toLowerCase()
    const connections = document.getElementsByClassName("connectionInput")
    if (user.length == 0){
        alert("Enter your name please")
        return
    }
    let connArr=  []
    for (let i = 0; i < connections.length; i++){
        if (connections[i].value.length == 0){
            alert("Make sure each connection name has a value")
            return
        }
        connArr.push(connections[i].value.toLowerCase())
        
    }
    //urlParams.has("group") use to check if it exists
    set(ref(database, "groups/" + groupName + "/" + user), {
        people: connArr
        
    });
    location.reload()
})
