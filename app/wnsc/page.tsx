import RecordForm from '@/components/RecordForm';
import RecordList from '@/components/RecordList';
export default function WNSCPage() {
  return (
    <div className="space-y-4">
      <RecordForm mode="WNSC" />
      <RecordList />
    </div>
  );
}
