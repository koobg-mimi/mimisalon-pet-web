import { Star } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

export function CustomerReviews() {
  const reviews = [
    {
      name: '김고객님',
      initial: '김',
      review:
        '집에서 편안하게 미용을 받을 수 있어서 너무 좋아요. 멍멍이도 스트레스 받지 않고 예쁘게 미용했어요!',
      rating: 5,
    },
    {
      name: '이사용자님',
      initial: '이',
      review: '미용사님이 정말 친절하시고 실력도 좋으세요. 야옹이가 예민한데도 잘 케어해주셨어요.',
      rating: 5,
    },
    {
      name: '박반려님',
      initial: '박',
      review:
        '온라인으로 쉽게 예약할 수 있고, 결과도 너무 만족스러워요. 다음에도 이용할 예정입니다!',
      rating: 5,
    },
  ]

  return (
    <section data-cy="customer-reviews" className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h3 className="mb-4 text-3xl font-bold">고객 후기</h3>
        <p className="text-muted-foreground">실제 이용하신 고객분들의 생생한 후기입니다</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {reviews.map((review, index) => (
          <Card key={index} data-cy="review">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-1">
                {[...Array(review.rating)].map((_, star) => (
                  <Star key={star} className="h-4 w-4 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                &ldquo;
                {review.review}
                &rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-muted text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                  {review.initial}
                </div>
                <span className="text-sm font-medium">{review.name}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
