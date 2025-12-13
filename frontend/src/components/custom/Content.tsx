import Button from '@/components/custom/mobile/ui/Button';

interface ContentProps {
  onScanClick?: () => void;
  onManualClick?: () => void;
  activeTab?: 'scan' | 'manual';
}

function Content({ onScanClick, onManualClick, activeTab = 'scan' }: ContentProps) {
  return (
    <div className="flex flex-row w-full h-fit items-center justify-center gap-3">
      <Button
        icon="bx:scan"
        text="Scan QR Code"
        variant={activeTab === 'scan' ? 'button-active' : 'button-inactive'}
        onClick={onScanClick}
      ></Button>
      <Button
        icon="material-symbols:person-search"
        text="Manual Entry"
        variant={activeTab === 'manual' ? 'button-active' : 'button-inactive'}
        onClick={onManualClick}
      ></Button>
    </div>
  );
}
export default Content;
