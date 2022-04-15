const url = ( window.location.hostname.includes('localhost') )
    ? 'http://localhost:3000/api/auth/'
    : 'https://server-node-crdv.herokuapp.com/api/auth/';



const myForm  = document.querySelector('form');
myForm.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData =  {};

    for (const el of myForm.elements) {
        if( el.name.length > 0 ){
            formData[el.name] = el.value;
        }
    }

    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then( resp => resp.json() )
        .then( ({ msg, token }) => {
            if( msg ) return console.error( msg );

            localStorage.setItem( 'token', token );
            window.location = 'chat.html';
        })
        .catch( console.log )
});



function handleCredentialResponse(response) {
            
    const body = { id_token: response.credential };


    fetch( url + 'google' , {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify( body )
    })
    .then( res =>  res.json() )
    .then( ({ token }) => {
        localStorage.setItem( 'token', token );
        window.location = 'chat.html';
    })
    .catch( console.warn )
}

const btnSO = document.getElementById('google_signout');
btnSO.onclick = () => {
    console.log( google.accounts.id );
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke( localStorage.getItem('token'), done => {
        localStorage.clear();
        location.reload();
    });
}