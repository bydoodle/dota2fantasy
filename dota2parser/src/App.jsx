import { useState } from 'react'
import data from './../../players_stat.json';
import heroes from './../../heroes.json';
import leagues from './../../leagues.json';
import { Select } from '@headlessui/react'
import './App.css'

function App() {
  const [selectedRole, setSelectedRole] = useState(0);

  const [sortBy, setSortBy] = useState(null);
  const filteredAndSorted = Object.entries(data)
    .filter(([_, info]) => selectedRole === null || info.general.pos === selectedRole)
    .sort(([_, aInfo], [__, bInfo]) => {
      if (!sortBy) return 0;

      const getAvg = (stats) => {
        const arr = (stats.red?.[sortBy] || stats.blue?.[sortBy] || stats.green?.[sortBy] || []);
        return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;
      };

      const multiplier = sortBy === 'deaths' ? -1 : 1;
      return multiplier * (getAvg(bInfo.stats) - getAvg(aInfo.stats));
  });
  
  const roles = {
    0: ['red', 'green', 'red'],
    1: ['red', 'blue', 'green'],
    2: ['blue', 'green', 'blue']
  }

  const multipliers = {
    'kills': 121,
    'deaths': 180,
    'creep_score': 3,
    'gpm': 2,
    'madstone_collected': 19,
    'tower_kills': 340,
    'obs_placed': 113,
    'camps_stacked': 170,
    'runes_grabbed': 121,
    'watchers_taken': 121,
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

  const [selectedOption, setSelectedOption] = useState([null, null, null, null, null, null, null, null, null]);
  const [selectedMultiplier, setSelectedMultiplier] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1]);
  const [selectedTitle, setSelectedTitle] = useState([null, null, null])

  return (
    <>
      <div className='p-40 relative w-full bg-gray-950 min-h-screen'>
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
        <section className='w-full flex flex-col gap-4'>
          <p className='text-white'>Choose your emblem stats and enter your multipliers, for example if you have 270% multiplier enter 2.7 instead. U will see 5 best players in descending order for each position</p>
          <h2 className='text-white text-2xl'>How does it counts?</h2>
          <p className='text-white'>
            <small>(sum of all players stats</small> <b>x</b> <small>their multipliers)</small> <b>+</b> <small>(games played with particular title</small> <b>x</b> <small>title percent</small> <b>/</b> <small>all players matches)</small><b>%</b>
            <br />
            For example: <br />
            <b>Beyond</b> played 10 matches and picked strength heroes in <b>6</b> of them. After choosing the Brawny title you will get <b>+13%</b> if player plays strength hero. <br />
            That means, average title +percent per game would be <u>6 x 13 / 10 = 7,8%</u> <br />
            Let's say we have next stats: <br />
            <b>kills</b> with <b>2.7</b> multiplier = beyond's average kills * 2.7 = <u>411.4 * 2.7 = 1110.78</u><br />
            <b>teamfight participation</b> with <b>2</b> multiplier = beyond's average TF participation * 2 = <u>1149.16 * 2 = 2298.31</u><br />
            <b>creep score</b> with <b>1.5</b> multiplier = beyond's average CS * 1.5 = <u>713.4 * 1.5 = 1070.10</u><br /> <br />
            The sum of all stats = <u>1110.78 + 2298.31 + 1070.10 = 4479.19</u><br />
            Final result = ((sum of all stats / 100) x (average title +percent/game)) + sum of all stats = <u>((4479.19 / 100) x 7.8) + 4479.19 = 4828.57</u>
          </p>
          <div className='grid grid-cols-3 gap-4'>
            {Object.keys(roles).map((role, index) => (
              <div
              key={role}
              className='flex flex-col gap-2 p-4 rounded-lg bg-purple-300 bg-opacity-25'>
                <div className='flex justify-between gap-2'>
                  <div className='w-[30%] flex flex-col justify-center'>
                    <h2 className='text-center text-white'>{{0: 'Core', 1: 'Mid', 2: 'Support'}[role]}</h2>
                    <Select
                      value={selectedTitle[index]}
                      onChange={(e) => setSelectedTitle(prev => {
                        const updated = [...prev];
                        updated[index] = e.target.value;
                        return updated;
                      })}
                      >
                        <option value="">none</option>
                        {Object.keys(data.Emo.titles).map((title, idx) => (
                          <option key={`${idx}-${title}`} value={title}>
                            {titlesInfo[title]['name']} {' - +'}{titlesInfo[title]['percent']}{'%'} {titlesInfo[title]['description']}
                          </option>
                        ))}
                      </Select>
                  </div>
                  <div>
                  {roles[role].map((color, idx) => (
                    <div
                    key={idx}
                    className={`grid grid-cols-2 gap-4 bg-${color}-900 bg-opacity-50 px-4 py-6`}>
                      <Select
                      value={selectedOption[idx + (role * 3)] || ''}
                      onChange={(e) => setSelectedOption(prev => {
                        const updated = [...prev];
                        updated[idx + (role * 3)] = e.target.value;
                        return updated;
                      })}
                      >
                        <option value="">none</option>
                        {Object.keys(data.Emo.stats[color]).map((stat, idx) => (
                          <option key={`${idx}-${stat}`} value={stat}>
                            {stat.replace('_', ' ')}
                          </option>
                        ))}
                      </Select>
                      <input
                      type="number"
                      value={selectedMultiplier[idx + (role * 3)]} 
                      onChange={(e) =>
                        setSelectedMultiplier(prev => {
                          const updated = [...prev];
                          updated[idx + (role * 3)] = Number(e.target.value); // пишем новое значение в массив
                          return updated;
                        })
                      } />
                    </div>
                  ))}
                  </div>
                </div>
                <div>
                  <h6 className="text-white">Best players:</h6>
                  <ul className='text-white'>
                    {Object.entries(data)
                      .filter(([name, info]) => info.general.pos === +role)
                      .map(([name, info]) => {
                        const total = roles[role].map((color, idx) => {
                          const stat = selectedOption[idx + role * 3];
                          if (!stat) return 0;
                          const arr = info.stats[color]?.[stat] ?? [];
                          if (!arr.length) return 0;

                          const multiplier = selectedMultiplier[idx + role * 3];
                          const statMultiplier = multipliers[stat] ?? 1
                          const titlePercent = (titlesInfo[selectedTitle[info.general.pos]]?.['percent'] * info.titles[selectedTitle[info.general.pos]]) / (info.stats.green.roshan_kills.length) || 0

                          if (stat === 'deaths') {
                            return ((1800 - (arr.reduce((sum, el) => sum + el, 0) / arr.length) * statMultiplier) * multiplier) + ((((1800 - (arr.reduce((sum, el) => sum + el, 0) / arr.length) * statMultiplier) * multiplier) / 100) * titlePercent);
                          } else {
                            return (((arr.reduce((sum, el) => sum + el, 0) / arr.length) * multiplier * statMultiplier) / 100) * titlePercent + ((arr.reduce((sum, el) => sum + el, 0) / arr.length) * multiplier * statMultiplier);
                          }
                        })
                        .reduce((a, b) => a + b, 0);

                        return { name, total };
                      })
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 5)
                      .map(({ name, total }) => (
                        <li key={name}>
                          {name}: {total.toFixed(2)}
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
          <p>* All data was taken from next tournaments: {Object.entries(leagues).map(([id, league], idx) => (
            <span key={id}>
              <a href={league.link} target='_blank' rel="noopener noreferrer" className='underline text-blue-500'>
                {league.name}
              </a>
              {idx < Object.entries(leagues).length - 1 && ", "}
            </span>
          ))} using <a href="https://docs.opendota.com/" className='underline text-blue-500' target='_blank' rel="noopener noreferrer">opendota.api</a> and <a href="https://stratz.com/" className='underline text-blue-500' target='_blank' rel="noopener noreferrer">stratz.com</a> </p>
          <p>* No data for stat 'lotuses grabbed' since it was unable to find this info</p>
          <p>* No data for title 'clutch(+11% when playing last possible match in the series)'</p>
          <p>* No data for Team Nemesis since they didn't participate in those tournaments.</p>
          <p>* No data for Tobi(Tundra Esports)</p>
        </div>
        <section className='relative flex flex-col items-center w-full gap-4 text-white py-8 mb-12'>
          <div className='flex justify-between w-full'>
            <h2
            className='w-full text-center font-bold text-5xl cursor-pointer'
            onClick={() => setSelectedRole(0)}>
              carry/offlane
            </h2>
            <h2 
            className='w-full text-center font-bold text-5xl cursor-pointer'
            onClick={() => setSelectedRole(1)}>
              mid
            </h2>
            <h2 
            className='w-full text-center font-bold text-5xl cursor-pointer'
            onClick={() => setSelectedRole(2)}>
              support
            </h2>
          </div>
          <div className='absolute left-0 bottom-0 h-1 w-[33.33%] bg-white transition duration-300'
          style={{ transform: `translateX(${selectedRole * 100}%)` }}></div>
        </section>
        <section className='flex flex-col w-full items-center justify-center py-8'>
          <h4 className='text-white'>Sort by:</h4>
          <Select name="sort" aria-label="Sort"
          value={sortBy || ''}
          onChange={(e) => setSortBy(e.target.value)}>
            <option value="">None</option>
            {Object.keys(data.Emo.stats).map(color => 
              Object.keys(data.Emo.stats[color]).map(stat => (
                <option key={`${color}-${stat}`} value={stat}>
                  {stat.replace('_', ' ')}
                </option>
              ))
            )}
          </Select>
        </section>
        <section className='grid grid-cols-4 gap-6'>
          {filteredAndSorted.map(([playerName, info], idx) =>
            <div
            key={playerName}
            className='flex flex-col gap-4 w-full bg-gray-900 p-4 rounded-lg border border-gray-800 text-white'>
              <div className='relative'>
                <h3 className='font-semibold text-4xl'>{playerName}</h3>
                <img src={info.general.team_logo} alt="" className='h-10 absolute right-0 top-0 object-contain' />
              </div>
              {info.general.pos === 0 || info.general.pos === 1 ? (
                <div className='bg-red-900 bg-opacity-25 py-2 px-4 rounded-lg'>
                  <p>
                    <b>Avg. kills: </b> 
                    {(info.stats.red.kills.reduce((sum, el) => sum + el, 0) / info.stats.red.kills.length * 121 *
                     ((selectedMultiplier[0] && selectedOption[0] == 'kills' && info.general.pos == 0) ? selectedMultiplier[0] : 1) *
                     ((selectedMultiplier[2] && selectedOption[2] == 'kills' && info.general.pos == 0) ? selectedMultiplier[2] : 1) * 
                     ((selectedMultiplier[3] && selectedOption[3] == 'kills' && info.general.pos == 1) ? selectedMultiplier[3] : 1)).toFixed(2)}.
                  </p>
                  <p>
                    <b>Avg. deaths: </b> 
                    {((1800 - ((info.stats.red.deaths.reduce((sum, el) => sum + el, 0) / info.stats.red.deaths.length) * 180)) *
                      ((selectedMultiplier[0] && selectedOption[0] == 'deaths' && info.general.pos == 0) ? selectedMultiplier[0] : 1) *
                      ((selectedMultiplier[2] && selectedOption[2] == 'deaths' && info.general.pos == 0) ? selectedMultiplier[2] : 1) * 
                      ((selectedMultiplier[3] && selectedOption[3] == 'deaths' && info.general.pos == 1) ? selectedMultiplier[3] : 1)).toFixed(2)};
                  </p>
                  <p>
                    <b>Avg. creep score: </b> 
                    {(info.stats.red.creep_score.reduce((sum, el) => sum + el, 0) / info.stats.red.creep_score.length * 3 *
                      ((selectedMultiplier[0] && selectedOption[0] == 'creep_score' && info.general.pos == 0) ? selectedMultiplier[0] : 1) *
                      ((selectedMultiplier[2] && selectedOption[2] == 'creep_score' && info.general.pos == 0) ? selectedMultiplier[2] : 1) * 
                      ((selectedMultiplier[3] && selectedOption[3] == 'creep_score' && info.general.pos == 1) ? selectedMultiplier[3] : 1)).toFixed(2)};
                  </p>
                  <p>
                    <b>Avg. GPM: </b> 
                    {(info.stats.red.gpm.reduce((sum, el) => sum + el, 0) / info.stats.red.gpm.length * 2 *
                      ((selectedMultiplier[0] && selectedOption[0] == 'gpm' && info.general.pos == 0) ? selectedMultiplier[0] : 1) *
                      ((selectedMultiplier[2] && selectedOption[2] == 'gpm' && info.general.pos == 0) ? selectedMultiplier[2] : 1) * 
                      ((selectedMultiplier[3] && selectedOption[3] == 'gpm' && info.general.pos == 1) ? selectedMultiplier[3] : 1)).toFixed(2)};
                  </p>
                  <p>
                    <b>Avg. madstone's collected: </b> 
                    {(info.stats.red.madstone_collected.reduce((sum, el) => sum + el, 0) / info.stats.red.madstone_collected.length * 19 *
                      ((selectedMultiplier[0] && selectedOption[0] == 'madstone_collected' && info.general.pos == 0) ? selectedMultiplier[0] : 1) *
                      ((selectedMultiplier[2] && selectedOption[2] == 'madstone_collected' && info.general.pos == 0) ? selectedMultiplier[2] : 1) * 
                      ((selectedMultiplier[3] && selectedOption[3] == 'madstone_collected' && info.general.pos == 1) ? selectedMultiplier[3] : 1)).toFixed(2)};
                  </p>
                  <p>
                    <b>Avg. tower kills: </b> 
                    {(info.stats.red.tower_kills.reduce((sum, el) => sum + el, 0) / info.stats.red.tower_kills.length * 340 *
                      ((selectedMultiplier[0] && selectedOption[0] == 'tower_kills' && info.general.pos == 0) ? selectedMultiplier[0] : 1) *
                      ((selectedMultiplier[2] && selectedOption[2] == 'tower_kills' && info.general.pos == 0) ? selectedMultiplier[2] : 1) * 
                      ((selectedMultiplier[3] && selectedOption[3] == 'tower_kills' && info.general.pos == 1) ? selectedMultiplier[3] : 1)).toFixed(2)};
                  </p>
                </div>
              ) : ''}
              {info.general.pos === 1 || info.general.pos === 2 ? (
                <div className='bg-blue-900 bg-opacity-25 py-2 px-4 rounded-lg'>
                  <p>
                    <b>Avg. wards placed: </b> 
                    {(info.stats.blue.obs_placed.reduce((sum, el) => sum + el, 0) / info.stats.blue.obs_placed.length * 113 *
                      ((selectedMultiplier[4] && selectedOption[4] == 'obs_placed' && info.general.pos == 1) ? selectedMultiplier[4] : 1) *
                      ((selectedMultiplier[6] && selectedOption[6] == 'obs_placed' && info.general.pos == 2) ? selectedMultiplier[6] : 1) * 
                      ((selectedMultiplier[8] && selectedOption[8] == 'obs_placed' && info.general.pos == 2) ? selectedMultiplier[8] : 1)).toFixed(2)};
                  </p>
                  <p>
                    <b>Avg. camps stacked: </b>
                     {(info.stats.blue.camps_stacked.reduce((sum, el) => sum + el, 0) / info.stats.blue.camps_stacked.length * 170 *
                      ((selectedMultiplier[4] && selectedOption[4] == 'camps_stacked' && info.general.pos == 1) ? selectedMultiplier[4] : 1) *
                      ((selectedMultiplier[6] && selectedOption[6] == 'camps_stacked' && info.general.pos == 2) ? selectedMultiplier[6] : 1) * 
                      ((selectedMultiplier[8] && selectedOption[8] == 'camps_stacked' && info.general.pos == 2) ? selectedMultiplier[8] : 1)).toFixed(2)};
                  </p>
                  <p>
                    <b>Avg. runes grabbed: </b> 
                    {(info.stats.blue.runes_grabbed.reduce((sum, el) => sum + el, 0) / info.stats.blue.runes_grabbed.length * 121 *
                      ((selectedMultiplier[4] && selectedOption[4] == 'runes_grabbed' && info.general.pos == 1) ? selectedMultiplier[4] : 1) *
                      ((selectedMultiplier[6] && selectedOption[6] == 'runes_grabbed' && info.general.pos == 2) ? selectedMultiplier[6] : 1) * 
                      ((selectedMultiplier[8] && selectedOption[8] == 'runes_grabbed' && info.general.pos == 2) ? selectedMultiplier[8] : 1)).toFixed(2)};
                  </p>
                  <p>
                    <b>Avg. watchers taken: </b> 
                    {(info.stats.blue.watchers_taken.reduce((sum, el) => sum + el, 0) / info.stats.blue.watchers_taken.length * 121 *
                      ((selectedMultiplier[4] && selectedOption[4] == 'watchers_taken' && info.general.pos == 1) ? selectedMultiplier[4] : 1) *
                      ((selectedMultiplier[6] && selectedOption[6] == 'watchers_taken' && info.general.pos == 2) ? selectedMultiplier[6] : 1) * 
                      ((selectedMultiplier[8] && selectedOption[8] == 'watchers_taken' && info.general.pos == 2) ? selectedMultiplier[8] : 1)).toFixed(2)};
                  </p>
                  <p>
                    <b>Avg. lotuses grabbed: </b> ?;
                  </p>
                  <p>
                    <b>Avg. smokes used: </b> 
                    {(info.stats.blue.smokes_used.reduce((sum, el) => sum + el, 0) / info.stats.blue.smokes_used.length * 283 *
                      ((selectedMultiplier[4] && selectedOption[4] == 'smokes_used' && info.general.pos == 1) ? selectedMultiplier[4] : 1) *
                      ((selectedMultiplier[6] && selectedOption[6] == 'smokes_used' && info.general.pos == 2) ? selectedMultiplier[6] : 1) * 
                      ((selectedMultiplier[8] && selectedOption[8] == 'smokes_used' && info.general.pos == 2) ? selectedMultiplier[8] : 1)).toFixed(2)};
                  </p>
                </div>
              ) : ''}
              <div className='bg-green-900 bg-opacity-25 py-2 px-4 rounded-lg'>
                <p>
                  <b>Avg. roshan kills: </b>
                  {(info.stats.green.roshan_kills.reduce((sum, el) => sum + el, 0) / info.stats.green.roshan_kills.length * 850 *
                      ((selectedMultiplier[1] && selectedOption[1] == 'roshan_kills' && info.general.pos == 0) ? selectedMultiplier[1] : 1) *
                      ((selectedMultiplier[5] && selectedOption[5] == 'roshan_kills' && info.general.pos == 1) ? selectedMultiplier[5] : 1) * 
                      ((selectedMultiplier[7] && selectedOption[7] == 'roshan_kills' && info.general.pos == 2) ? selectedMultiplier[7] : 1)).toFixed(2)};
                </p>
                <p>
                  <b>Avg. teamfight participation: </b> 
                  {(info.stats.green.teamfight_participation.reduce((sum, el) => sum + el, 0) / info.stats.green.teamfight_participation.length * 1895 *
                      ((selectedMultiplier[1] && selectedOption[1] == 'teamfight_participation' && info.general.pos == 0) ? selectedMultiplier[1] : 1) *
                      ((selectedMultiplier[5] && selectedOption[5] == 'teamfight_participation' && info.general.pos == 1) ? selectedMultiplier[5] : 1) * 
                      ((selectedMultiplier[7] && selectedOption[7] == 'teamfight_participation' && info.general.pos == 2) ? selectedMultiplier[7] : 1)).toFixed(2)};
                </p>
                <p>
                  <b>Avg. stuns: </b> 
                  {(info.stats.green.stuns.reduce((sum, el) => sum + el, 0) / info.stats.green.stuns.length * 15 *
                      ((selectedMultiplier[1] && selectedOption[1] == 'stuns' && info.general.pos == 0) ? selectedMultiplier[1] : 1) *
                      ((selectedMultiplier[5] && selectedOption[5] == 'stuns' && info.general.pos == 1) ? selectedMultiplier[5] : 1) * 
                      ((selectedMultiplier[7] && selectedOption[7] == 'stuns' && info.general.pos == 2) ? selectedMultiplier[7] : 1)).toFixed(2)};
                </p>
                <p>
                  <b>Avg. tormentor kills: </b>
                   {(info.stats.green.tormentor_kills.reduce((sum, el) => sum + el, 0) / info.stats.green.tormentor_kills.length * 850 *
                      ((selectedMultiplier[1] && selectedOption[1] == 'tormentor_kills' && info.general.pos == 0) ? selectedMultiplier[1] : 1) *
                      ((selectedMultiplier[5] && selectedOption[5] == 'tormentor_kills' && info.general.pos == 1) ? selectedMultiplier[5] : 1) * 
                      ((selectedMultiplier[7] && selectedOption[7] == 'tormentor_kills' && info.general.pos == 2) ? selectedMultiplier[7] : 1)).toFixed(2)};
                </p>
                <p>
                  <b>Avg. courier kills: </b> 
                  {(info.stats.green.courier_kills.reduce((sum, el) => sum + el, 0) / info.stats.green.courier_kills.length * 850 *
                      ((selectedMultiplier[1] && selectedOption[1] == 'courier_kills' && info.general.pos == 0) ? selectedMultiplier[1] : 1) *
                      ((selectedMultiplier[5] && selectedOption[5] == 'courier_kills' && info.general.pos == 1) ? selectedMultiplier[5] : 1) * 
                      ((selectedMultiplier[7] && selectedOption[7] == 'courier_kills' && info.general.pos == 2) ? selectedMultiplier[7] : 1)).toFixed(2)};
                </p>
                <p>
                  <b>Avg. first blood: </b> 
                  {(info.stats.green.firstblood.reduce((sum, el) => sum + el, 0) / info.stats.green.firstblood.length * 1700 *
                      ((selectedMultiplier[1] && selectedOption[1] == 'firstblood' && info.general.pos == 0) ? selectedMultiplier[1] : 1) *
                      ((selectedMultiplier[5] && selectedOption[5] == 'firstblood' && info.general.pos == 1) ? selectedMultiplier[5] : 1) * 
                      ((selectedMultiplier[7] && selectedOption[7] == 'firstblood' && info.general.pos == 2) ? selectedMultiplier[7] : 1)).toFixed(2)};
                </p>
              </div>
              <h5><b>Total games:</b> {info.stats.green.roshan_kills.length}</h5>
              <div>
                {Object.entries(info.titles).map(([key, value]) => (
                  <h5 key={key}>
                    {(() => {
                      switch (key) {
                        case 'str': return 'strength heroes played: ';
                        case 'agi': return 'agility heroes played: ';
                        case 'int': return 'intelligence heroes played: ';
                        case 'all': return 'universal heroes played: ';
                        case 'green': return 'green heroes played: ';
                        case 'blue': return 'blue heroes played: ';
                        case 'red': return 'red heroes played: ';
                        case 'undead': return 'undead/demon/spirit heroes played: ';
                        case 'horns': return 'horns/wings heroes played: ';
                        case 'bearded': return 'bearded/fuzzy heroes played: ';
                        case 'aquatic': return 'aquatic/fiery/icy heroes played: ';
                        case 'first_pick': return 'firstpicked: ';
                        case 'last_pick': return 'lastpicked: ';
                        case 'games_with_arcana': return 'arcana equipped: ';
                        case 'games_with_hero_master': return '25+ dota plus hero level: ';
                      }
                    })()}
                    {value}
                  </h5>
                ))}
                <br />
                {}
              </div>
              <p>
                <b>Data fetched from:</b> <br/> {' '}
                {info.leagues.map((leagueId, idx) => {
                  const league = leagues[leagueId]; // вытаскиваешь объект по id
                  return (
                    <span key={leagueId}>
                      <a
                        href={league.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-500"
                      >
                        {league.name}
                      </a><br/>
                    </span>
                  );
                })}
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default App
