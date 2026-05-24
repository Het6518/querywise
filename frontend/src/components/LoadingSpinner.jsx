import { LoaderCircle } from 'lucide-react';

const messages = ['Analyzing Query...', 'Generating Optimization...', 'Building Query Tree...'];

export default function LoadingSpinner() {
  return (
    <div className="paper-card border-l-[6px] border-l-app-accent p-6">
      <div className="flex items-center gap-4">
        <LoaderCircle className="animate-spin text-app-accent" size={30} />
        <div className="space-y-2">
          {messages.map((message, index) => (
            <p
              key={message}
              className="font-sans text-sm font-medium text-app-muted"
              style={{ animation: `pulse 1.4s ease-in-out ${index * 0.2}s infinite` }}
            >
              {message}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
