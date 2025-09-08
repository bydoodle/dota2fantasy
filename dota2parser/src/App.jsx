import { useState } from 'react'
import data from './../../players_stat.json';
import heroes from './../../heroes.json';
import leagues from './../../leagues.json';
import { Select } from '@headlessui/react'
import './App.css'

function App() {
  const [selectedTournaments, setSelectedTournaments] = useState(Object.keys(leagues));
  const [selectedRole, setSelectedRole] = useState(0);
  const [isHIW, setIsHIW] = useState(false);

  const getAvgStat = (info, color, statKey) => {
  // Берём только выбранные турниры
  const selectedLeaguesData = Object.entries(info)
    .filter(([leagueId]) => selectedTournaments.includes(leagueId));

  let allValues = [];
  selectedLeaguesData.forEach(([_, leagueData]) => {
    const stats = leagueData?.stats?.[color]?.[statKey];
    if (stats) allValues.push(...stats);
  });

  if (allValues.length === 0) return 0;

  const avg = allValues.reduce((sum, el) => sum + el, 0) / allValues.length;

  // Подбираем индексы для мультипликаторов
  const multiplierIndexes = {
    red: color === "red" ? [0, 2, 4, 5, 8] : [],
    blue: color === "blue" ? [6, 10, 12, 14] : [],
    green: color === "green" ? [1, 3, 7, 9, 11, 13] : [],
  };

  const multiplier = multiplierIndexes[color].reduce((acc, idx) => {
    if (selectedOptionExtended[idx] === statKey && info.general.pos === (idx < 5 ? 0 : idx < 10 ? 1 : 2)) {
      return acc * selectedMultiplierExtended[idx];
    }
    return acc;
  }, 1);

  // Специальная формула для deaths
  if (statKey === "deaths") {
    return ((1800 - avg * 180) * multiplier).toFixed(2);
  }

  // Остальные статы
  const factor = {
    kills: 121,
    creep_score: 3,
    gpm: 2,
    madstone_collected: 57,
    tower_kills: 340,
    roshan_kills: 850,
    teamfight_participation: 1895,
    stuns: 15,
    tormentor_kills: 850,
    courier_kills: 850,
    firstblood: 1700,
    obs_placed: 113,
    camps_stacked: 170,
    runes_grabbed: 121,
    watchers_taken: 90,
    smokes_used: 283,
  };

  return (avg * (factor[statKey] || 1) * multiplier).toFixed(2);
};

const RedStats = ({ info }) => (
  <div className="bg-red-500 bg-opacity-20 py-2 px-4 rounded-lg">
    {["kills","deaths","creep_score","gpm","madstone_collected","tower_kills"].map(stat => (
      <p key={stat}>
        <b>Avg. {stat.replace("_"," ")}: </b> {getAvgStat(info,"red",stat)}
      </p>
    ))}
  </div>
);

const BlueStats = ({ info }) => (
  <div className="bg-blue-500 bg-opacity-20 py-2 px-4 rounded-lg">
    {["obs_placed","camps_stacked","runes_grabbed","watchers_taken","smokes_used"].map(stat => (
      <p key={stat}>
        <b>Avg. {stat.replace("_"," ")}: </b> {getAvgStat(info,"blue",stat)}
      </p>
    ))}
  </div>
);

const GreenStats = ({ info }) => (
  <div className="bg-green-500 bg-opacity-20 py-2 px-4 rounded-lg">
    {["roshan_kills","teamfight_participation","stuns","tormentor_kills","courier_kills","firstblood"].map(stat => (
      <p key={stat}>
        <b>Avg. {stat.replace("_"," ")}: </b> {getAvgStat(info,"green",stat)}
      </p>
    ))}
  </div>
);

const getAvgForSort = (info, statKey) => {
  // Выбираем только турниры пользователя
  const selectedLeaguesData = Object.entries(info)
    .filter(([leagueId]) => selectedTournaments.includes(leagueId));

  let allValues = [];

  selectedLeaguesData.forEach(([_, leagueData]) => {
    // Проверяем все цвета
    ['red', 'blue', 'green'].forEach(color => {
      const arr = leagueData?.stats?.[color]?.[statKey];
      if (arr) allValues.push(...arr);
    });
  });

  if (allValues.length === 0) return 0;

  return allValues.reduce((sum, v) => sum + v, 0) / allValues.length;
};

  const [sortBy, setSortBy] = useState(null);
  const filteredAndSorted = Object.entries(data)
  .filter(([_, info]) => selectedRole === null || info.general.pos === selectedRole)
  .sort(([_, aInfo], [__, bInfo]) => {
    if (!sortBy) return 0;

    const multiplier = sortBy === 'deaths' ? -1 : 1;

    return multiplier * (getAvgForSort(bInfo, sortBy) - getAvgForSort(aInfo, sortBy));
  });
  
  const roles = {
    0: ['red', 'green', 'red'],
    1: ['red', 'blue', 'green'],
    2: ['blue', 'green', 'blue']
  }

  const rolesExtended = {
    0: ['red', 'green', 'red', 'green', 'red'],
    1: ['red', 'blue', 'green', 'red', 'green'],
    2: ['blue', 'green', 'blue', 'green', 'blue']
  }

  const multipliers = {
    'kills': 121,
    'deaths': 180,
    'creep_score': 3,
    'gpm': 2,
    'madstone_collected': 57,
    'tower_kills': 340,
    'obs_placed': 113,
    'camps_stacked': 170,
    'runes_grabbed': 121,
    'watchers_taken': 90,
    'smokes_used': 283,
    'roshan_kills': 850,
    'teamfight_participation': 1895,
    'stuns': 15,
    'tormentor_kills': 850,
    'courier_kills': 850,
    'firstblood': 1700
  }

  const titlesInfo = {
    'str': {
      name: 'Brawny',
      description: 'when playing strength hero',
      percent: 13,
    },
    'agi': {
      name: 'Dashing',
      description: 'when playing agility hero',
      percent: 15,
    },
    'int': {
      name: 'Canny',
      description: 'when playing intelligence hero',
      percent: 11
    },
    'all': {
      name: 'Balanced',
      description: 'when playing universal hero',
      percent: 15
    },
    'green': {
      name: 'Emerald',
      description: 'when playing green hero',
      percent: 18
    },
    'blue': {
      name: 'Cerulean',
      description: 'when playing blue hero',
      percent: 19
    },
    'red': {
      name: 'Crimson',
      description: 'when playing red hero',
      percent: 13
    },
    'undead': {
      name: 'Otherwordly',
      description: 'when playing undead/demon/spirit hero',
      percent: 13
    },
    'horns': {
      name: 'Bestial',
      description: 'when playing horns/wings hero',
      percent: 15
    },
    'bearded': {
      name: 'Hirsute',
      description: 'when playing bearded/fuzzy hero',
      percent: 10
    },
    'aquatic': {
      name: 'Elemental',
      description: 'when playing aquatic/fiery/icy hero',
      percent: 15
    },
    'first_pick': {
      name: 'Sacrificial',
      description: 'when players hero is chosen first',
      percent: 15
    },
    'last_pick': {
      name: 'Coveted',
      description: 'when players hero chosen last',
      percent: 15
    },
    'games_with_arcana': {
      name: 'Glamorous',
      description: 'when players hero has arcana equipped',
      percent: 25
    },
    'games_with_hero_master': {
      name: 'Virtuoso',
      description: 'when players hero has Master/Grandmaster tier',
      percent: 13
    }
  }

  const subtitlesInfo = {
    '0_kills': {
      name: 'Pacifist',
      description: 'if player ends game with 0 kills',
      percent: 8,
    },
    'lowest_networth': {
      name: 'Ant',
      description: 'if player has the lowest networth',
      percent: 8,
    },
    'bbs_before_30min': {
      name: 'Bull',
      description: 'in games where player buybacks before 30 min',
      percent: 9
    },
    'most_deaths': {
      name: 'North Piligrim',
      description: 'if player has the most games deaths',
      percent: 15
    },
    '4+_active_items': {
      name: 'Octopus',
      description: 'in games where player has 4 or more active items',
      percent: 7
    },
    'most_assists': {
      name: 'Accompice',
      description: 'if player has the most assists',
      percent: 7
    },
    '9_slots': {
      name: 'Mule',
      description: 'when player has 9 slots in his inventory and backpack',
      percent: 21
    },
    "lost_games": {
      name: 'Underdog',
      description: "when player's team lost",
      percent: 6
    },
    "most_voice_lines": {
      name: 'Loquacious',
      description: 'in games where the player uses the most voicelines',
      percent: 7
    },
    "total_deaths_from_torm": {
      name: 'Tormented',
      description: 'if any player dies to a tormentor',
      percent: 9
    },
    "firstblood_before_10min": {
      name: 'Patient',
      description: 'if first blood after 10 min',
      percent: 13
    },
    "firstblood_before_horn": {
      name: 'Flayed Twins Acolyte',
      description: 'if first blood before the horn',
      percent: 7
    },
    "games<25min": {
      name: 'Decisive',
      description: 'in games that last less than 25min',
      percent: 25
    }
  }

  const backgrounds = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
  };

  const [selectedOption, setSelectedOption] = useState([null, null, null, null, null, null, null, null, null]);
  const [selectedMultiplier, setSelectedMultiplier] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1]);
  const [selectedTitle, setSelectedTitle] = useState([null, null, null]);
  const [selectedSubtitle, setSelectedSubtitle] = useState([null, null, null]);

  const [selectedOptionExtended, setSelectedOptionExtended] = useState([null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
  const [selectedMultiplierExtended, setSelectedMultiplierExtended] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

  return (
    <>
      <div className='p-40 pb-10 relative w-full bg-gray-950 min-h-screen flex flex-col gap-12'>
        <header className='flex justify-between absolute top-0 left-0 h-36 items-center w-full px-40'>
          <a href="https://buymeacoffee.com/nineteenqq" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee"  className="h-14" target="_blank" />
          </a>
          <div className='flex gap-4'>
            <a href="https://steamcommunity.com/id/doodlehateu/" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/512px-Steam_icon_logo.svg.png?20220611141426" alt="" className="h-14" />
            </a>
            <a href="https://github.com/bydoodle/dota2fantasy" target="_blank" rel="noopener noreferrer">
              <img src="github-mark-white.png" className="h-14" alt="" />
            </a>
          </div>
        </header>
        {isHIW && (
          <div className='backdrop-blur-sm fixed w-screen h-screen left-0 top-0 bg-gray-950 bg-opacity-50 z-10'>
            <div className='absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] backdrop-blur-sm rounded-lg border border-zinc-900 bg-zinc-800 bg-opacity-80 z-10 p-8'>
              <button className='absolute right-8 top-8' onClick={() => setIsHIW(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-12">
                  <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg>
              </button>
              <p className="text-white leading-relaxed w-max">
                <span className="block mb-2 font-semibold">Calculation formula:</span>
                <span className="block">
                  (sum of all players stats <b>x</b> their multipliers) <b>+</b> <br />
                  (games played with particular subtitle <b>x</b> subtitle percent <b>/</b> all players matches) <b>+</b> <br />
                  (games played with particular title <b>x</b> title percent <b>/</b> all players matches)
                </span>

                <span className="block mt-4 font-semibold">Example:</span>
                <span className="block mt-2">
                  Let's say we choose 2 tournaments to fetch data from - TI 2025 and PGL Wallachia.
                  <b>33</b> played <b>34</b> matches and picked strength heroes in <b>12</b> of them. <br />
                  After choosing the <b>Brawny</b> title, you will get <b>+13%</b> if the player plays a strength hero.
                  <br />
                  Average title +percent per game would be: <u>12 × 13 / 34 = 4.58%</u>
                </span>

                <span className="block mt-2">
                  <b>Subtitles calculation:</b> The formula is similar, except for conditions specific to each subtitle:
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>Tormented: +9% if any player dies to a tormentor</li>
                    <li>Patient: +13% if first blood occurs after minute 10</li>
                    <li>Decisive: +25% if the game lasts less than 25 minutes</li>
                    <li>Flayed Twins Acolyte: +7% if first blood occurs before the horn</li>
                  </ul>
                  <br />
                  Data for these subtitles is taken from your chosen tournaments.
                  <br />
                  For example, if you select PGL Wallachia and TI 2025, and pick the Flayed Twins Acolyte subtitle:
                  <br />
                  In PGL Wallachia, first blood before the horn occurred in 11 out of 92 matches, and in TI 2025, 9 out of 84 matches.
                  <br />
                  We multiply the subtitle by the given percent and divide by total matches:  
                  (11 × 7 / 92) = 0.83 and (9 × 7 / 84) = 0.75
                  <br />
                  Then we average the results across the tournaments:  
                  (0.83 + 0.75) / 2 = 0.79%
                </span>

                <span className="block mt-4 font-semibold">Player stats:</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>
                    <b>Kills</b> with multiplier <b>2.7</b>: 
                    33's average kills × 2.7 = <u>597.88 × 2.7 = 1614.28</u>
                  </li>
                  <li>
                    <b>Teamfight participation</b> with multiplier <b>2</b>: 
                    33's average TF participation × 2 = <u>1189.04 × 2 = 2378.09</u>
                  </li>
                  <li>
                    <b>Creep score</b> with multiplier <b>1.5</b>: 
                    33's average CS × 1.5 = <u> 932.56 × 1.5 = 1398.84</u>
                  </li>
                </ul>

                <span className="block mt-4 font-semibold">Sum of stats:</span>
                <span className="block mt-1"><u>1614.28 + 2378.09 + 1398.84 = 5391.21</u></span>

                <span className="block mt-4 font-semibold">Final result:</span>
                <span className="block mt-1">
                  ((sum of all stats / 100) × average title +percent per game) + ((sum of all stats / 100) × average subtitle +percent per game) + sum of all stats = <br />
                  <u>((5391.21 / 100) × 4.58) + ((5391.21 / 100) × 0.79) + 5391.21 = 5682.66</u>
                </span>
              </p>
            </div>
          </div>
        )}
        <section className='w-full flex flex-col gap-4 items-center'>
          <h2 className='text-white font-bold text-5xl'>Select tournaments</h2>
          <h3 className='text-white'>Choose tournaments to fetch data from</h3>
          <div className='text-white flex w-full justify-between gap-4'>
            {Object.entries(leagues).map(([league, data]) => (
              <div key={data.name} className='bg-gradient-to-b from-transparent from-20% rounded-md to-purple-900 p-4 flex flex-col w-full'>
                <label htmlFor={`league-${league}`} className='text-lg' >
                  <input type="checkbox" id={`league-${league}`} className='mr-2'
                  checked={selectedTournaments.includes(league)}
                  onChange={() =>
                    setSelectedTournaments(prev =>
                      prev.includes(league)
                        ? prev.filter(id => id !== league)
                        : [...prev, league]
                    )
                  } />
                {data.short_name}</label>
                <div className='flex w-full mt-4'>
                  <span className='whitespace-nowrap'>Total matches parsed:</span>
                  <div className='w-full h-[1px] bg-white self-end mb-1 bg-opacity-30'></div>
                  <b className='ml-auto'>{data.total_matches_parsed}</b>
                </div>
                <div className='flex w-full'>
                  <span className='whitespace-nowrap'>Deaths from tormentor:</span>
                  <div className='w-full h-[1px] bg-white self-end mb-1 bg-opacity-30'></div>
                  <b className='ml-auto'>{data.total_deaths_from_torm}</b>
                </div>
                <div className='flex w-full'>
                  <span className='whitespace-nowrap'>Firstblood after min 10:</span>
                  <div className='w-full h-[1px] bg-white self-end mb-1 bg-opacity-30'></div>
                  <b className='ml-auto'>{data.firstblood_before_10min}</b>
                </div>
                <div className='flex w-full'>
                  <span className='whitespace-nowrap'>Firstblood before horn:</span>
                  <div className='w-full h-[1px] bg-white self-end mb-1 bg-opacity-30'></div>
                  <b className='ml-auto'>{data.firstblood_before_horn}</b>
                </div>
                <div className='flex w-full'>
                  <span className='whitespace-nowrap'>Games &lt;25min:</span>
                  <div className='w-full h-[1px] bg-white self-end mb-1 bg-opacity-30'></div>
                  <b className='ml-auto'>{data['games<25min']}</b>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className='relative w-full flex flex-col gap-4 items-center'>
          <h2 className='text-white font-bold text-5xl'>Select your stats</h2>
          <h3 className='text-white text-center'>Choose your titles, subtitles, stats and their multipliers <br />* Enter fraction instead of percents, for example if you have 270% multiplier enter 2.7 instead.</h3>
          <button className='text-yellow-500 text-2xl absolute right-0 top-12 cursor-pointer' onClick={() => setIsHIW(true)}>How does it counts?</button>
          <div className='grid grid-cols-3 gap-4'>
            {Object.keys(rolesExtended).map((role, index) => (
              <div
              key={role}
              className='flex flex-col gap-2 p-4 bg-gradient-to-b from-purple-900 rounded-md to-transparent'>
                <div className='flex justify-between gap-4'>
                  <div className='w-[40%] flex flex-col mt-6 gap-6'>
                    <h2 className='text-center text-white text-5xl'>{{0: 'Core', 1: 'Mid', 2: 'Support'}[role]}</h2>
                    <Select
                      value={selectedTitle[index] || ''}
                      onChange={(e) => setSelectedTitle(prev => {
                        const updated = [...prev];
                        updated[index] = e.target.value;
                        return updated;
                      })}
                      className='p-1 rounded-sm focus:outline-none'
                      >
                        <option value="">Select title</option>
                        {Object.keys(data.Xm[18358].titles).map((title, idx) => (
                          <option key={`${idx}-${title}`} value={title || ''}>
                            {titlesInfo[title]['name']} {' - +'}{titlesInfo[title]['percent']}{'%'} {titlesInfo[title]['description']}
                          </option>
                        ))}
                        <option disabled className='text-red-600'>
                          Clutch - +11% when playing last possible match in the series(NO DATA)
                        </option>
                      </Select>
                      <Select
                      value={selectedSubtitle[index] || ''}
                      onChange={(e) => setSelectedSubtitle(prev => {
                        const updated = [...prev];
                        updated[index] = e.target.value;
                        return updated;
                      })}
                      className='p-1 rounded-sm'
                      >
                        <option value="">Select subtitle</option>
                        {Object.entries(subtitlesInfo).map(([name, info], idx) => (
                          <option key={`${idx}-${name}`} value={name || ''}>
                            {info.name} {' - +'}{info.percent}{'%'} {info.description}
                          </option>
                        ))}
                        <option disabled className='text-red-600'>
                          Thief - +9% in games where any player steals divine rapier(NO DATA)
                        </option>
                        <option disabled className='text-red-600'>
                          Raven - +6% if any player gets a rampage(NO DATA)
                        </option>
                      </Select>
                  </div>
                  <div className='flex flex-col gap-2'>
                  {rolesExtended[role].map((color, idx) => (
                    <div
                    key={idx}
                    className={`flex justify-between gap-2 ${backgrounds[color]} bg-opacity-30 rounded-md px-4 py-6`}
                    >
                      <Select
                      value={selectedOptionExtended[idx + (role * 5)] || ''}
                      onChange={(e) => setSelectedOptionExtended(prev => {
                        const updated = [...prev];
                        updated[idx + (role * 5)] = e.target.value;
                        return updated;
                      })}
                      className='w-[100%] p-1 rounded-sm'
                      >
                        <option value="">None</option>
                        {Object.keys(data.Xm[18358].stats[color]).map((stat, idx) => (
                          <option key={`${idx}-${stat}`} value={stat || ''} className={stat == 'watchers_taken' ? 'text-red-600' : ''}>
                            {stat.replace('_', ' ')}
                            {stat == ('watchers_taken' || 'madstone_collected') ? '(data is not 100% accurate)' : ''}
                          </option>
                        ))}
                        {color == 'blue' ? (
                          <option disabled className='text-red-600'>
                            lotuses grabbed(NO DATA)
                          </option>
                        ) : ''}
                      </Select>
                       <input
                      type="number"
                      className='w-[30%] text-black rounded-sm p-1 focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]'
                      value={selectedMultiplierExtended[idx + (role * 5)] || ''} 
                      onChange={(e) =>
                        setSelectedMultiplierExtended(prev => {
                          const updated = [...prev];
                          updated[idx + (role * 5)] = Number(e.target.value);
                          return updated;
                        })
                      } />
                    </div>
                  ))}
                  </div>
                </div>
                <div className='flex flex-col items-center'>
                  <h6 className="text-white text-3xl my-4">Best players:</h6>
                  <ul className='text-white grid grid-flow-col grid-rows-8 grid-cols-2 w-full gap-x-8'>
                    {Object.entries(data)
                      .filter(([name, info]) => info.general.pos === +role)
                      .map(([name, info]) => {
                        const total = rolesExtended[role].map((color, idx) => {
                          const stat = selectedOptionExtended[idx + role * 5];
                          if (!stat) return 0;
                          const multiplier = selectedMultiplierExtended[idx + role * 5];
                          const statMultiplier = multipliers[stat] ?? 1;
                          const selectedLeagues = Object.entries(info)
                            .filter(([leagueId]) => selectedTournaments.includes(leagueId));

                          let allValues = [];
                          let titlePercent = 0;
                          let subtitlePercent = 0;

                          selectedLeagues.forEach(([leagueId, leagueData]) => {
                            const leagueStats = leagueData?.stats[color];
                            if (!leagueStats) return;

                            const key = stat || Object.keys(leagueStats)[0];
                            const arr = leagueStats[key] ?? [];
                            allValues = [...allValues, ...arr]

                            titlePercent +=
                            ((titlesInfo[selectedTitle[info.general.pos]]?.percent *
                              leagueData.titles[selectedTitle[info.general.pos]]) /
                              leagueData.stats.green.roshan_kills.length) || 0;

                            if (selectedSubtitle[info.general.pos] in leagues[leagueId]) {
                              subtitlePercent +=
                              ((subtitlesInfo[selectedSubtitle[info.general.pos]]?.percent *
                                leagues[leagueId][selectedSubtitle[info.general.pos]]) /
                                leagues[leagueId].total_matches_parsed) || 0;
                            } else {
                              subtitlePercent +=
                              ((subtitlesInfo[selectedSubtitle[info.general.pos]]?.percent *
                                leagueData.subtitles[selectedSubtitle[info.general.pos]]) /
                                leagueData.stats.green.roshan_kills.length) || 0;
                            }
                          });

                          titlePercent = titlePercent / selectedLeagues.length
                          subtitlePercent = subtitlePercent / selectedLeagues.length

                          if (allValues.length === 0) return 0;

                          const avg = allValues.reduce((sum, el) => sum + el, 0) / allValues.length;

                          if (stat === "deaths") {
                            return (
                              (1800 - avg * statMultiplier) * multiplier +
                              (((1800 - avg * statMultiplier) * multiplier) / 100) * (titlePercent + subtitlePercent)
                            );
                          } else {
                            return ((avg * multiplier * statMultiplier) / 100) * (titlePercent + subtitlePercent) +
                              avg * multiplier * statMultiplier;
                          }
                        })
                        .reduce((a, b) => a + b, 0);

                        return { name, total };
                      })
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 16)
                      .map(({ name, total }) => (
                        <li key={name} className='whitespace-nowrap flex justify-between'>
                          <span>{name}</span><div className='h-[1px] w-full bg-white bg-opacity-20 self-end mb-1'></div><span>{total.toFixed(2)}</span>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className='w-full text-gray-300 py-16'>
          <p>* All data was taken using <a href="https://docs.opendota.com/" className='underline text-blue-500' target='_blank' rel="noopener noreferrer">opendota.api</a> and <a href="https://stratz.com/" className='underline text-blue-500' target='_blank' rel="noopener noreferrer">stratz.com</a> </p>
          <p>* No data for stat 'lotuses grabbed' since it was unable to find this info</p>
          <p>* No data for title 'clutch(+11% when playing last possible match in the series)'</p>
          <p>* No data for next subtitles:
            <br />
            Thief(+9% in games where any player steals divine rapier),
            <br />
            Raven(+6% if any player gets a rampage),
            <br />
            </p>
        </div>
        <section className='relative flex flex-col items-center w-full gap-4 text-white py-8 mb-12'>
          <div className='flex justify-between w-full'>
            <h2
            className='w-full text-center font-bold text-5xl cursor-pointer'
            onClick={() => setSelectedRole(0)}>
              Core
            </h2>
            <h2 
            className='w-full text-center font-bold text-5xl cursor-pointer'
            onClick={() => setSelectedRole(1)}>
              Mid
            </h2>
            <h2 
            className='w-full text-center font-bold text-5xl cursor-pointer'
            onClick={() => setSelectedRole(2)}>
              Support
            </h2>
          </div>
          <div className='absolute left-0 bottom-0 h-1 w-[33.33%] bg-white transition duration-300'
          style={{ transform: `translateX(${selectedRole * 100}%)` }}></div>
        </section>
        <section className='flex flex-col w-full items-center justify-center py-8'>
          <h4 className='text-white text-lg'>Sort by:</h4>
          <Select name="sort" aria-label="Sort"
          className='p-1 rounded-sm'
          value={sortBy || ''}
          onChange={(e) => setSortBy(e.target.value)}>
            <option value="">None</option>
            {Object.keys(data.Xm[18358].stats).map(color => 
              Object.keys(data.Xm[18358].stats[color]).map(stat => (
                <option key={`${color}-${stat}`} value={stat || ''}>
                  {stat.replace('_', ' ')}
                </option>
              ))
            )}
          </Select>
        </section>
        <section className='grid grid-cols-4 gap-6'>
          {filteredAndSorted.map(([playerName, info]) => (
            <div key={playerName} className='flex flex-col gap-4 w-full bg-gradient-to-b from-purple-950 to-transparent p-4 rounded-lg text-white'>
              <div className='relative'>
                <h3 className='font-semibold text-4xl'>{playerName}</h3>
                <img src={info.general.team_logo} alt="" className='h-10 absolute right-0 top-0 object-contain' />
              </div>
              <h5><b>Total matches:</b>  {Object.entries(info)
                .filter(([leagueId, leagueData]) => 
                  selectedTournaments.includes(leagueId) && leagueData.stats?.green?.roshan_kills
                )
                .reduce((sum, [_, leagueData]) => sum + leagueData.stats.green.roshan_kills.length, 0)}
              </h5>
              {(info.general.pos === 0 || info.general.pos === 1) && <RedStats info={info} />}
              {(info.general.pos === 1 || info.general.pos === 2) && <BlueStats info={info} />}
              <GreenStats info={info} />
              <div>
                <h6><b>Titles:</b></h6>
                {(() => {
                  const aggregatedTitles = {};

                  const titleLabels = {
                    str: 'Strength heroes played',
                    agi: 'Agility heroes played',
                    int: 'Intelligence heroes played',
                    all: 'Universal heroes played',
                    green: 'Green heroes played',
                    blue: 'Blue heroes played',
                    red: 'Red heroes played',
                    undead: 'Undead/demon/spirit heroes played',
                    horns: 'Horns/wings heroes played',
                    bearded: 'Bearded/fuzzy heroes played',
                    aquatic: 'Aquatic/fiery/icy heroes played',
                    first_pick: 'First picked',
                    last_pick: 'Last picked',
                    games_with_arcana: 'Arcana equipped',
                    games_with_hero_master: '25+ Dota Plus hero level',
                  };

                  Object.entries(info)
                    .filter(([leagueId, leagueData]) => selectedTournaments.includes(leagueId))
                    .forEach(([_, leagueData]) => {
                      if (!leagueData.titles) return;
                      Object.entries(leagueData.titles).forEach(([key, value]) => {
                        aggregatedTitles[key] = (aggregatedTitles[key] || 0) + value;
                      });
                    });

                  return Object.entries(aggregatedTitles).map(([key, value]) => (
                    <div key={key}>
                      {titleLabels[key] || key}: {value}
                    </div>
                  ));
                })()}
              </div>
              <div>
                <h6><b>Subtitles:</b></h6>
                {(() => {
                  const aggregatedSubtitles = {};

                  const subtitleLabels = {
                    '0_kills': 'Games without kills',
                    'lowest_networth': 'Lowest networth',
                    'bbs_before_30min': 'Buyback before 30min',
                    'most_deaths': 'Has the most deaths',
                    '4+_active_items': '4 or more active items',
                    'most_assists': 'Has the most assists',
                    '9_slots': '9 slots in inventory',
                    'lost_games': 'Lost games',
                    'most_voice_lines': 'Most voice lines'
                  };

                  Object.entries(info)
                    .filter(([leagueId, leagueData]) => selectedTournaments.includes(leagueId))
                    .forEach(([_, leagueData]) => {
                      if (!leagueData.subtitles) return;
                      Object.entries(leagueData.subtitles).forEach(([key, value]) => {
                        aggregatedSubtitles[key] = (aggregatedSubtitles[key] || 0) + value;
                      });
                    });

                  return Object.entries(aggregatedSubtitles).map(([key, value]) => (
                    <div key={key}>
                      {subtitleLabels[key]}: {value}
                    </div>
                  ));
                })()}
              </div>
            </div>
          ))}
        </section>
        <h6 className='text-white w-full text-center mt-16'>zoom.show сын сами знаете кого</h6>
      </div>
    </>
  )
}

export default App
