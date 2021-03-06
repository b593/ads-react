import { ucFirst } from "uvk";
import { leagueHelper } from "../../helpers/leagueHelper";
import { teamHelper } from "../../helpers/teamHelper";
import { DATE_FORMAT } from "../../../const";
import { newsGenerator } from "../../helpers/newshelper";
import { randomizer } from "../../generators";
import { messageGenerator } from "../../helpers";

export const seasonOver = ({ status, context }) => {
    const today = status.date;
    const { team } = status;
    let { name, season, table, scorers } = context.league;
    const positionMap = {};
    const orderedTable = leagueHelper.orderedTable(table);
    orderedTable.forEach((r, index) => {
        let position = index + 1;
        positionMap[r.name] = { ...r, position };
    });
    scorers = leagueHelper.orderedScorers(scorers);

    Object.keys(context.teams.hash).forEach(t => {
        t = context.teams.hash[t];
        t.stats.history.push({ season, ...positionMap[t.name] });
    });

    let position = {};
    if (team) {
        position = { ...positionMap[team] };
    }

    status.history.seasons.push({ name, season, table: orderedTable, scorers });
    status.history.player.push({ season, team: team, position });

    context.league.table = teamHelper.createCleanTable(context.teams.list);
    context.league.fixture = [];
    context.league.scorers = {};
    context.league.lineups = {};

    const winner = orderedTable[0];
    const second = orderedTable[1];
    const third = orderedTable[2];
    const topScorer = scorers[0];
    const topScorerPlayer = `${topScorer.player.name} ${topScorer.player.surname}`;
    const news = [
        newsGenerator.generate(
            `Season finished, ${winner.name} won the ${name} ${season}!`,
            `The ${name} ${season} winner has been announced: **${winner.name}** !\n` +
            `They won the league with **${winner.points}** points, seconded by **${second.name}** with **${second.points}** points.\n` +
            `**${ucFirst(third.name)}** classified third instead, with **${third.points}** points.\n` +
            `The scorers table instead was dominated by **${topScorerPlayer}** (**${topScorer.team}**) with **${topScorer.goals}** goals.`,
            today.format(DATE_FORMAT)
        ),
        newsGenerator.generate(
            'Transfer Market Opened!', 'Transfer Market has reopened', today.format(DATE_FORMAT)
        )
    ];
    status.marketOpen = true;
    return { status, context, news };
};

export const teamOffersContract = ({ status, context }) => {
    const { teams } = context;
    const { misc = {} } = status;

    if (randomizer.chance(70)) {
        // this should be based on the fame
        return { status, context };
    }

    let team = null;
    if (Object.keys(misc.teams).length > 0) {
        const offeringTeams = Object.values(misc.teams).filter(t => t.offering === true).map(t => t.id);
        team = randomizer.pickOne(teams.list.filter(t => !offeringTeams.includes(t.id)));
    } else {
        team = randomizer.pickOne(teams.list);
    }

    let messages = null;

    if (team) {
        misc.teams[team.id] = misc.teams[team.id] ? { ...misc.teams[team.id], offering: true } : { id: team.id, offering: true };

        messages = messageGenerator.generate(
            'Contract Offer',
            team.name,
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            status.date.format(DATE_FORMAT)
        );
    }
    return { status, context, messages };
};
