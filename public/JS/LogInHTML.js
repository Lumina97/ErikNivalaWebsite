


async function CreateAccount() {
    const username = document.getElementById('UsernameInput').value;
    const password = document.getElementById('PasswordInput').value;

    const sendData = { username, password };
    const final = JSON.stringify(sendData);
    console.log('Sending Data: ' + final);

    const options = {
        method: 'POST',
        body: final,
        headers: { 'Content-Type': 'application/json' }
    };
    const response = await fetch('/CreateAccount', options);

    const data = response.json()
   
    const urlstring = response.url.toString();
    if(urlstring.includes('LogIn'))
    {
        const data = response.json().then((result) => {
            console.log(result);
             document.getElementById('LogInErrorText') = result;
        });
    }
    else
    {
        location.href= urlstring;
    }   
}

async function SubmitLogin() {
    const username = document.getElementById('UsernameInput').value;
    const password = document.getElementById('PasswordInput').value;

    const sendData = { username, password };
    const final = JSON.stringify(sendData);
    console.log('Sending Data: ' + final);

    const options = {
        method: 'POST',
        body: final,
        headers: { 'Content-Type': 'application/json' }
    };
    const response = await fetch('/LogIn', options);
    const urlstring = response.url.toString();
    
    if(urlstring.includes('LogIn'))
    {
        const data = response.json().then((result) => {
            console.log(result);
            document.getElementById('LogInErrorText') = textbox.textContent = result;
        });
    }
    else
    {
        location.href= urlstring;
    }
}