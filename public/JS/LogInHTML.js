const textbox = document.getElementById('LogInErrorText');
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

    const data = response.json().then((result) => {
        console.log(result);

        const textbox = document.getElementById('LogInErrorText');

        if (result == "true")
        {
            textbox.textContent = "Account Created scuessful";
            console.log("Account Created  scuessful");
        }
        else {
            textbox.textContent = result;
        }

    });
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
            textbox.textContent = result;
        });
    }
    else
    {
        location.href= urlstring;
    }
}