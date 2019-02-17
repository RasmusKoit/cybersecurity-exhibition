window.addEventListener('keydown', result);
// document.querySelector('#showResult').addEventListener('keydown', result);


function startTyping(){
    typing();
}



function result(){
    let i = 0;
    let fetching = 'Fetching Data...';

    function typing(){

        if(i<fetching.length){
            document.querySelector('#fetching').innerHTML += fetching.charAt(i);
            i++;
            setTimeout(typing, 50);
        }

    }

    typing();

        setTimeout(function(){
        let output = `
            <p>C://</p>
            <ul>
                <li>Country: </li>
                <li>First Name: </li>
                <li>Last Name: </li>
                <li>Display Name: </li>
                <li>Email: </li>
                <li>Password: </li>
            </ul>
        `;

        document.querySelector('#showResult').innerHTML = output;

    }, 2000);

}
