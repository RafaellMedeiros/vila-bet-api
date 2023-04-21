class Utils {

    static gamePoints(results, gameResults) {
        let points = 0;

        results.forEach(result => {
            if (result) {
                gameResults.forEach( gameResult => {
                    if (result.id == gameResult.gameWeek_id && result.result == gameResult.result) {
                        points++;
                    }
                })
            }
        });
        return points
    }
} 



module.exports = Utils;