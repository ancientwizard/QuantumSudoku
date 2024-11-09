// shuffelArray( array[] )

export
function shuffleArray<T> ( array: T[] ): T[]
{
    const shuffledArray = [...array];
    let currentIndex = shuffledArray.length
    let randomIndex;

    // While there remain elements to shuffle...
    while ( currentIndex !== 0 )
    {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[currentIndex]];
    }

    return shuffledArray;
}


// vim: expandtab number tabstop=4
// END