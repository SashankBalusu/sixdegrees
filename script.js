import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";
  
// TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
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


  const linkgen = document.getElementById("linkgen")
  const submitGroup = document.getElementById("submitGroup")
  const group = document.getElementById("group")
  
  submitGroup.addEventListener("click", function(){
      let groupName = group.value
      if (groupName.length == 0){
        alert("Please enter a group name")  
        return
      }
      if (groupName.includes(" ")){
        alert("Please enter a group name without spaces")  
        return
      }

      get(ref(database, "groups/")).then((info) => {
        if ((info.exists())){
            console.log(info.val())
            let groupNames = info.val()
            for (let key in groupNames){
                if (groupName == key){
                    alert("group name taken, pick a new one.")
                    return
                }
            }
            set(ref(database, "groups/" + groupName), {
                groupName: groupName
                
            });
          
          
        }
        
      }).catch((error) => {
          alert("Error occured, change group name please")
          console.error(error);
      });
      linkgen.setAttribute("style", "display: block")
      linkgen.innerHTML = `<a href = "https://www.sashankbalusu.github.io/sixdegrees/view.html?group=${groupName}">sashankbalusu.github.io/sixdegrees/view.html?group=${groupName}</a>`
      //linkgen.value = `sashankbalusu.github.io/sixdegrees/view.html?group=${groupName}`
  })

