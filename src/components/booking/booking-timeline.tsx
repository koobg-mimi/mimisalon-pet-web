import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'created' | 'confirmed' | 'reminded' | 'completed' | 'cancelled' | 'updated';
  actor?: {
    name: string;
    role: 'CUSTOMER' | 'GROOMER' | 'ADMIN' | 'SYSTEM';
  };
}

interface BookingTimelineProps {
  events: TimelineEvent[];
}

export function BookingTimeline({ events }: BookingTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'created':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        );
      case 'confirmed':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        );
      case 'reminded':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5zM4 12v5a3 3 0 003 3h5"
              />
            </svg>
          </div>
        );
      case 'completed':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        );
      case 'updated':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  const getActorName = (actor: TimelineEvent['actor']) => {
    if (!actor) return '시스템';

    switch (actor.role) {
      case 'CUSTOMER':
        return `${actor.name} (고객)`;
      case 'GROOMER':
        return `${actor.name} (미용사)`;
      case 'ADMIN':
        return `${actor.name} (관리자)`;
      case 'SYSTEM':
        return '시스템';
      default:
        return actor.name;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss', { locale: ko });
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, index) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {index !== events.length - 1 && (
                <span
                  className="bg-border absolute top-4 left-4 -ml-px h-full w-0.5"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>{getEventIcon(event.type)}</div>
                <div className="min-w-0 flex-1">
                  <div>
                    <p className="text-foreground text-sm font-medium">{event.title}</p>
                    <p className="text-muted-foreground text-sm">{event.description}</p>
                    <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                      <span>{formatDate(event.timestamp)}</span>
                      {event.actor && (
                        <>
                          <span>•</span>
                          <span>{getActorName(event.actor)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
