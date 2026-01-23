import { Home, Scissors, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function ServiceFeatures() {
  const features = [
    {
      icon: Home,
      title: '방문 서비스',
      description: '집에서 편안하게! 미용사가 직접 방문하여 우리 아이의 스트레스를 최소화합니다.',
    },
    {
      icon: Scissors,
      title: '미용사',
      description: '미용사들이 우리 아이의 특성에 맞는 맞춤형 미용 서비스를 제공합니다.',
    },
    {
      icon: Timer,
      title: '간편 예약',
      description: '온라인으로 간편하게 예약하고, 원하는 시간에 미용 서비스를 받으실 수 있습니다.',
    },
  ];

  return (
    <section data-cy="service-features" className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} data-cy="feature-card">
            <CardHeader>
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <feature.icon className="text-primary h-6 w-6" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
