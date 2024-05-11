module.exports = new (class ResultAnalyzerService {
  findHighestScore(result) {
    const r = {
      winners: [],
      score: 0,
    };

    result.forEach((d) => {
      if (d.score > r.score) {
        r.winners = [];
        r.score = d.score;
        r.winners.push(d.teamName);
      } else if (d.score === r.score) {
        r.winners.push(d.teamName);
      }
    });

    return r;
  }
})();
