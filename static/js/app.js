let getCookie = (name) => {
    let nameEQ = name + '=';
    let allCookies = document.cookie.split(';');

    for (let i = 0; i < allCookies.length; i++) {
        let c = allCookies[i];

        while (c.charAt(0) == ' ') 
            c = c.substring(1, c.length);

        if (c.indexOf(nameEQ) == 0) 
            return c.substring(nameEQ.length, c.length);
    }
    
    return null;
}

let setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; samesite=strict; path=/";
}

let login = async (e) => {
    e.preventDefault();

    let response = await fetch('/login', {
        method: 'post',
        body: new FormData(frmLogin)
    });

    let result = await response.json();
    console.log(result);
    setCookie('creds', result.token, 1);
    document.location = '/index';
};