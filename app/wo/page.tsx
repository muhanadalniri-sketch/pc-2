import RecordForm from '@/components/RecordForm';
import RecordList from '@/components/RecordList';
export default function WOPage() {
  return (
    <div className="space-y-4">
      <RecordForm mode="WO" />
      <RecordList />
    </div>
  );
}
