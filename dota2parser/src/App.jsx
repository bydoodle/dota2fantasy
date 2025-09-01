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
    'stuns': 128,
    'tormentor_kills': 850,
    'courier_kills': 850,
    'firstblood': 1700
  }

  const [selectedOption, setSelectedOption] = useState([null, null, null, null, null, null, null, null, null]);
  const [selectedMultiplier, setSelectedMultiplier] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1]);

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
          <div className='flex justify-between gap-4'>
          {Object.keys(roles).map((role) => (
            <div
            key={role}
            className='flex flex-col gap-2 p-4 rounded-lg bg-purple-300 bg-opacity-25'>
              <h4 className='text-center text-white'>{{0: 'Core', 1: 'Mid', 2: 'Support'}[role]}</h4>
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
                    {Object.keys(data.Malr1ne.stats[color]).map((stat, idx) => (
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

                      if (stat === 'deaths') {
                        return (1800 - (arr.reduce((sum, el) => sum + el, 0) / arr.length) * statMultiplier) * multiplier;
                      } else {
                        return (arr.reduce((sum, el) => sum + el, 0) / arr.length) * multiplier * statMultiplier;
                      }
                    }).reduce((a, b) => a + b, 0);

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
          ))} using <a href="https://docs.opendota.com/" className='underline text-blue-500' target='_blank' rel="noopener noreferrer">opendota.api</a></p>
          <p>* No data for 'lotuses grabbed' since it was unable to find this info</p>
          <p>* No data for Team Nemesis since they didn't participate in those tournaments.</p>
          <p>09.01.2025 UPDATE: added Larl(Team Spirit), removed Whitemon(Tundra Esports) <br /> </p>
          <small> <br /> I saw some videos about this website and I'm so glad it spreads up amongs community, if u have any questions, suggestions etc. u can write me on <a href="https://steamcommunity.com/id/doodlehateu/" target='_blank' className='underline text-blue-500' rel="noopener noreferrer">steam</a> </small>
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
            {Object.keys(data.Malr1ne.stats).map(color => 
              Object.keys(data.Malr1ne.stats[color]).map(stat => (
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
                  {(info.stats.green.stuns.reduce((sum, el) => sum + el, 0) / info.stats.green.stuns.length * 128 *
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
              {/* <h5><b>Tournaments: </b>
                {info.leagues.map(league => league + ', ')}
              </h5> */}
              <h5><b>Total games:</b> {info.stats.green.roshan_kills.length}</h5>
              <div>
                {['agi','str','int','all'].map(attr => (
                  <h5 key={attr}>
                    <b>Total {(() => {
                      switch (attr) {
                        case 'agi': return 'agility';
                        case 'str': return 'strength';
                        case 'int': return 'intelligence';
                        case 'all': return 'universal';
                      }
                    })()
                    } heroes played:</b>{" "}
                    {Object.keys(info.heroes || {})
                      .filter(heroId => heroes[heroId]?.attr === attr)
                      .reduce((sum, heroId) => sum + info.heroes[heroId], 0)}
                  </h5>
                ))}
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
