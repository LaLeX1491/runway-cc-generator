import InputHeadline from '@/components/ui/InputHeadline';
import SwitchField from '@/components/ui/SwitchField';
import Code from '@/components/ui/code';

export default function StaticItemSelector({content, title, tooltip, linkToIcao, value, toggleContent}: { content: string, title: string, tooltip: string, linkToIcao: string, value: boolean, toggleContent: () => void }) {
  return (
    <div>
      <InputHeadline title={title} tooltip={tooltip} linkToIcao={linkToIcao} />
      <SwitchField checked={value} onClick={toggleContent} label="Include item" />
      <div className={`transition-opacity duration-300 ${value ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
        {value && <Code text={content} />}
      </div>
    </div>
  );
}
