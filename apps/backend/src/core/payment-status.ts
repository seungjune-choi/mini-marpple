export enum PaymentStatus {
  PENDING = 'pending',           // 결제 대기 중
  PROCESSING = 'processing',     // 결제 처리 중
  COMPLETED = 'completed',       // 결제 완료
  FAILED = 'failed',             // 결제 실패
  CANCELLED = 'cancelled',       // 결제 취소됨
  REFUNDED = 'refunded',         // 환불됨
  PARTIALLY_REFUNDED = 'partially_refunded', // 부분 환불됨
  AUTHORIZED = 'authorized',     // 결제 승인됨 (카드 결제 등에서 사용)
  CAPTURED = 'captured',         // 결제 금액 청구됨
  VOIDED = 'voided',             // 결제 취소됨 (승인 후 청구 전 취소)
  DISPUTED = 'disputed',         // 분쟁 중 (차지백 등)
  EXPIRED = 'expired',           // 결제 만료됨 (특정 시간 내 미완료)
}