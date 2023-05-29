class Utils {
  static gamePoints(results, gameResults) {
    let points = 0;

    results.forEach((result) => {
      if (result) {
        gameResults.forEach((gameResult) => {
          if (
            result.id == gameResult.gameWeek_id &&
            result.result == gameResult.result
          ) {
            points++;
          }
        });
      }
    });
    return points;
  }

  static convertDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return {
      fullDate: day + "/" + month + "/" + year,
      hours: hours + ":" + minutes,
    };
  }
}

module.exports = Utils;
