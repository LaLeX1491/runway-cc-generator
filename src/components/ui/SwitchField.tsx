import { Switch } from "./switch";

export default function SwitchField({ checked, onClick, label }: { checked: boolean; onClick: () => void; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onClick={onClick} />
      <span>{label}</span>
    </div>
  );
}