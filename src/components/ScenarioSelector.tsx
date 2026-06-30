import { Scenario } from '../data/scenarios';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  activeId: string;
  onChange: (id: string) => void;
}

export function ScenarioSelector({ scenarios, activeId, onChange }: ScenarioSelectorProps) {
  const active = scenarios.find((s) => s.id === activeId);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="scenario-select" className="text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
        Scenario
      </label>
      <select
        id="scenario-select"
        value={activeId}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 text-white text-sm rounded-md px-2 py-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        title={active?.description}
      >
        {scenarios.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
