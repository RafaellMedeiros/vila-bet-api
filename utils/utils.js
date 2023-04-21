class Utils {

    static gamePoints(results, gameResults) {
        const points = 0;

        results.forEach(result => {
            gameResults.forEach( gameResult => {
                if (result.id == gameResult.gameWeek_id && result.result == result.result) {
                    points++;
                }
            })
        });
        return points
    }
} 



module.exports = Utils;