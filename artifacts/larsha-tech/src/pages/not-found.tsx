import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-sm">
        <p className="text-7xl font-black text-primary mb-4">404</p>
        <h1 className="text-2xl font-black text-foreground mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you were looking for.
        </p>
        <Button onClick={() => navigate('/')}>Go back home</Button>
      </div>
    </div>
  );
}
