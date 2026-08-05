import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <EmptyState
        icon={MapPinOff}
        title="Page not found"
        description="The page you're looking for doesn't exist or has been moved."
        action={
          <Link to="/">
            <Button>Go home</Button>
          </Link>
        }
      />
    </div>
  );
}
