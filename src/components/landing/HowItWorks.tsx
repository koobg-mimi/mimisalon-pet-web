import { CheckCircle, LogIn, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export function HowItWorks() {
  const steps = [
    {
      icon: LogIn,
      title: '1. 로그인',
      description: '고객 계정으로 로그인하세요',
    },
    {
      icon: MapPin,
      title: '2. 주소 입력',
      description: '방문받을 주소를 입력하세요',
    },
    {
      icon: Users,
      title: '3. 미용사 선택',
      description: '지역별 전문 미용사를 선택하세요',
    },
    {
      icon: CheckCircle,
      title: '4. 예약 완료',
      description: '결제 후 예약이 확정됩니다',
    },
  ];

  return (
    <section data-cy="how-it-works" className="container mx-auto px-4 py-16">
      <Card>
        <CardContent className="p-8">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-bold">간단한 예약 과정</h3>
            <p className="text-muted-foreground">4단계로 완성되는 방문미용 예약</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} data-cy="step" className="space-y-4 text-center">
                <div className="bg-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                  <step.icon className="text-primary-foreground h-8 w-8" />
                </div>
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
