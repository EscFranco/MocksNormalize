function getRandomNumbers(number) {
    let numbers = {};
    for(let i = 0; i < number; ++i) {
        let randomNumber = Math.floor(Math.random() * 1000) + 1;
        if (!numbers.hasOwnProperty(randomNumber)) {
            numbers = {...numbers, ...{
                [randomNumber] : 1
            }}
        }  else {
            numbers[randomNumber]++
        }

    }
    return numbers
}

process.on('message', (msg) => {
    console.log(msg);
    process.send(getRandomNumbers(msg));
    process.exit();
})

process.send('OK')