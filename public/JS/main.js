const regForm = document.querySelector(".register-form")
const logoutBtn = document.querySelector(".logout-btn")

if(regForm!=null){
    
    regForm.onsubmit =  async(e)=>{
        e.preventDefault()
    
        let dataPost ={
            signin:regForm.id
        }
        
        if(dataPost.signin == 'signin'){
            dataPost.un=document.querySelector("#your_name").value
            dataPost.pw = document.querySelector("#your_pass").value
        }else{//signup
            dataPost.un=document.querySelector("#username").value
            dataPost.n=document.querySelector("#name").value
            dataPost.pw=document.querySelector("#pass").value
            dataPost._id=document.querySelector("#_id").value
            dataPost.email=document.querySelector("#email").value
            dataPost.dob=document.querySelector("#dob").value
            dataPost.permission=document.querySelector("#agree-term").value
        }
        console.log(dataPost)
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(dataPost)
        };
        try {
            const fetchResponse = await fetch("/signin", settings);
            const data = await fetchResponse.json();
            if(dataPost.signin=="signin"){
                if(data.statuscode==1){
                    window.location.href="/"
                }
                else if(data.statuscode==0){
                    window.location.href="/fail"
                }
            }else{
                window.location.href="/"
            }
        } catch (e) {
            return e;
        }
    }
}
if(logoutBtn!=null){
    logoutBtn.onclick =  async(e)=>{
    let dataPost ={
        signin:"logout"
    }
    const fetchResponse = await fetch("/signin", 
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(dataPost)
        }
    );
    window.location.href="/"
}
}